import generate_csv
import snif

def main():
    interface = input("Please enter your network interface name :")
    snif.main(interface)


if __name__ == '__main__':
    main()
