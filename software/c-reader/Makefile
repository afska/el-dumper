# Command-line client
CMDLINE = reader.exe

# By default, build the firmware and command-line client
all: $(CMDLINE)

# One-liner to compile the command-line client
$(CMDLINE): reader.c
	gcc -O -Wall reader.c rs232.c -o reader.exe

# Housekeeping if you want it
clean:
	$(RM) *.exe
