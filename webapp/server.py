from flask import Flask, session, request
from flask_socketio import SocketIO, emit
from flask import render_template
from eventlet import wsgi
import eventlet

from webapp.bluetooth_service import BluetoothConnection
from webapp.bluetooth_service import BluetoothScraper
from webapp.exceptions import BluetoothException
from webapp.config import serverInfo


app = Flask(__name__)
async_mode = 'threading'
socketio = SocketIO(app, async_mode=async_mode)

eventlet.monkey_patch()
background_thread = None


def bluetooth_connection(device_address):
    # Create a bluetooth connection instance for a device
    connection = BluetoothConnection(device_address)
    data = dict()

    try:
        connection.connect_device()
        connection_status = True
        data['message'] = "Connection " \
                          "successful!"
    except BluetoothException as e:
        data['message'] = str(e)
        connection_status = False

        global background_thread
        background_thread = False

    data['status'] = connection_status
    socketio.emit('connection_status', {'data': data})


@app.route('/')
@app.route('/index/')
def index():
    return render_template('index.html', async_mode=async_mode)


@socketio.on('get_devices', namespace='')
def get_devices():
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
    device_address = received_data['address']
    global background_thread
    background_thread = socketio.start_background_task(target=bluetooth_connection, device_address=device_address)


if __name__ == '__main__':
    wsgi.server(eventlet.listen((serverInfo.host, serverInfo.port)), app)
