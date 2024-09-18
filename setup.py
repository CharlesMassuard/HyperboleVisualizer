from setuptools import setup, find_packages

setup(
    name='GPS_DECODER_V2',
    version='1.0.0',
    packages=find_packages(),
    install_requires=[
        'Pillow',
        'PyQt5'
    ],
    entry_points={
        'console_scripts': [
            'gps_decoder_v2 = gps_decoder_v2.program:main',
        ],
    },
)