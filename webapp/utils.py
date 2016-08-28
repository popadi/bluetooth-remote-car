from webapp.exceptions import BluetoothException
import bluetooth


def get_connected_devices():
    try:
        devices = bluetooth.discover_devices(duration=5, lookup_names=True)
    except Exception as e:
        raise BluetoothException(type(e).__name__, str(e))

    if not devices:
        raise BluetoothException(error_type="0 devices found",
                                 error_text="Press the logo to search again.")

    devices_json_list = []
    for address, name in devices:
        if address and name:
            devices_json_list.append({'address': address, 'name': name})

    return devices_json_list
