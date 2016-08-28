class BluetoothException(Exception):
    def __init__(self, error_type, error_text):
        self.error_type = error_type
        self.error_text = error_text

    def __str__(self):
        return "{0}: {1}".format(self.error_type, self.error_text)

    def __repr__(self):
        return "{0}: {1}".format(self.error_type, self.error_text)
