from flask import Flask, session, request, redirect, url_for
from flask_socketio import SocketIO, emit
from flask import render_template
from eventlet import wsgi
import eventlet
import bluetooth

from webapp.bluetooth_service import BluetoothConnection
from webapp.bluetooth_service import BluetoothScraper
from webapp.exceptions import BluetoothException
from webapp.config import serverInfo

app = Flask(__name__)
async_mode = 'threading'
socketio = SocketIO(app, async_mode=async_mode)

eventlet.monkey_patch()
background_thread = None
active_connection = None
connected_users = 0


def bluetooth_connection():
    global active_connection
    k = 1

    while True:
        data = active_connection.recv_data()
        data = data.decode("utf-8")

        if data != "":
            print(data)

            # active_connection.send_data(str(k % 2))
            k += 1


@app.route('/')
@app.route('/index/')
def index():
    """
    The index page of the web application. It has two forms: a master and a
    visitor form. If you're the first user online, you have access to the
    master page and can select the bluetooth device to connect to. If you
    are a visitor, you can see the real-time processing.
    :return: A rendered template.
    """
    global connected_users
    if connected_users <= 1:
        return render_template('index_master.html', async_mode=async_mode)
    return render_template('index_visitor.html', async_mode=async_mode)


@socketio.on('get_devices', namespace='')
def get_devices():
    """
    If we receive a get_devices signal, we try to initialize
    a BluetoothScraper and search for near devices. If there
    are any errors, we return a list of them (they will be
    rendered by the front-end).
    """
    data = dict()
    try:
        bt_scraper = BluetoothScraper()
        bt_scraper.search_devices()
        data['devices'] = bt_scraper.get_devices()
    except BluetoothException as e:
        print(e)
        data['errors'] = str(e)

    emit('print_devices', {'data': data})


@socketio.on('connect_device', namespace='')
def connect_device(received_data):
    # Create a bluetooth connection instance for a device
    """
    Attept to create a connection between the computer and the
    device. If everything is good, return a success message and
    pass the connection to the global varialbe active_connection.
    Otherwise, return a dictionary with errors and mark the
    active connection as None.
    :param received_data: the address to connect to.
    """
    device_address = received_data['address']
    connection = BluetoothConnection(device_address)
    data = dict()

    # Try to connect to the device or return an error
    # message. Mark the active_connection as true.
    try:
        connection.connect_device()
        connection_status = True
        data['message'] = "Connection successful! " \
                          "Click here to continue."
    except BluetoothException as e:
        data['message'] = str(e)
        connection_status = False

    data['status'] = connection_status
    socketio.emit('connection_status', {'data': data})

    global active_connection
    if connection_status:
        active_connection = connection
    else:
        active_connection = None


@app.route('/menu/')
def menu():
    """
    The menu page (interface) of the remote car. Here we can choose
    to manually control the car using the PC, using a remote control
    or to start the map generator feature.
    """
    return render_template('menu.html', async_mode=async_mode)


@app.route('/remotepc/')
def start_background_thread():
    """
    If we have an active connection set, we start the background
    analyzer and redirect the master to the generator page. If
    the active_connection is None, we redirect the user back to
    the index page.
    :return:
    """
    global active_connection
    if active_connection is not None:
        print("[*] Background worked started!")
        # socketio.start_background_task(target=bluetooth_connection)
        return render_template('remotepc.html', async_mode=async_mode)
    else:
        return redirect(url_for('index'))


@socketio.on('connect', namespace='')
def connect():
    """
    In this method we keep track of the connected users. For
    any new devices connected to the application server, we
    increment the global variable for the connected users and
    print a message in the console (for debug reasons).
    """
    global connected_users
    connected_users += 1
    print("[*] New device connected! (Total: {0})".format(connected_users))


@socketio.on('move_car', namespace='')
def move_car(received_data):
    movedir = received_data['direction']
    print(movedir)

    active_connection.send_data(movedir)


@socketio.on('disconnect', namespace='')
def test_disconnect():
    """
    In this method we keep track of the connected users. For
    any new devices disconnected to the application server, we
    decrement the global variable for the connected users and
    print a message in the console (for debug reasons).
    """
    global connected_users
    connected_users -= 1
    print("[*] Client disconnected! (Total: {0})".format(connected_users))


if __name__ == '__main__':
    wsgi.server(eventlet.listen((serverInfo.host, serverInfo.port)), app)
