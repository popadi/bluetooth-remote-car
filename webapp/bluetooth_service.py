import bluetooth
from .config import BTConfig
from .exceptions import BluetoothException


class BluetoothConnection(object):
    def __init__(self, address):
        self.address = address
        self.channel = BTConfig.channel
        self.connection = None

    def connect_device(self):
        try:
            self.connection = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
            self.connection.connect((self.address, self.channel))
            print("Device connected!")
        except Exception as e:
            raise BluetoothException(type(e).__name__, str(e))

    def send_data(self, command):
        self.connection.send(command)

    def close_connection(self):
        self.connection.close()