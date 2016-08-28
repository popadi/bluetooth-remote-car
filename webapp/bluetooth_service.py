from .exceptions import BluetoothException
from webapp.config import BTConfig
import bluetooth


class BluetoothScraper(object):
    def __init__(self):
        self.devices = []

    def search_devices(self):
        """
        Using the bluetooth module of the device, search for any bluetooth
        active devices in the area. This method also return any devices the
        computer ever made a pair with. If the computer does not have a BT
        module or any other error occurs, a custom exception is raised.
        """
        try:
            self.devices = bluetooth.discover_devices(duration=BTConfig.getTimeout(),
                                                      lookup_names=True)
        except Exception as e:
            raise BluetoothException(type(e).__name__, str(e))

    def get_devices(self):
        """
        Returns an a list of dictionaries with every device that was found
        by the @search_devices method above. If the list is empty, a custom
        exception is being raised.
        :return: a list of devices, with their name and address.
        """
        if not self.devices:
            raise BluetoothException(error_type="Error: ",
                                     error_text="0 devices found!")

        devices_list = []
        for address, name in self.devices:
            if address and name:
                devices_list.append({'address': address, 'name': name})

        return devices_list


class BluetoothConnection(object):
    def __init__(self, address):
        self.address = address
        self.channel = BTConfig.channel
        self.connection = None

    def connect_device(self):
        """
        Attempt to connect to a device, given an address. If the connection
        fails, a custom exception is being raised. The user must know the
        COM port of the device he is going to use. No python module so far
        can detect the COM port associated with an address. The port number
        must be configured in config.py file.
        """
        try:
            self.connection = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
            self.connection.connect((self.address, self.channel))
        except Exception as e:
            raise BluetoothException(type(e).__name__, str(e))

    def send_data(self, data):
        """
        Send data to the current active connection.
        :param data: The data to be sent to the device.
        """
        # TODO: Exception handling
        self.connection.send(data)

    def close_connection(self):
        """
        Attempt to close the active bluetooth connection with the device.
        """
        # TODO: Exception handling
        self.connection.close()
