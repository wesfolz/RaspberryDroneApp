from dronekit import connect, VehicleMode
import time

vehicle = connect('/dev/ttyACM0', wait_ready=True)


print "Autopilot Firmware version: %s" % vehicle.version
#print "Autopilot capabilities (supports ftp): %s" % vehicle.capabilities.ftp
print "Global Location: %s" % vehicle.location.global_frame
print "Global Location (relative altitude): %s" % vehicle.location.global_relative_frame
print "Local Location: %s" % vehicle.location.local_frame    #NED
print "Attitude: %s" % vehicle.attitude
print "Velocity: %s" % vehicle.velocity
print "GPS: %s" % vehicle.gps_0
print "Groundspeed: %s" % vehicle.groundspeed
print "Airspeed: %s" % vehicle.airspeed
print "Gimbal status: %s" % vehicle.gimbal
print "Battery: %s" % vehicle.battery
print "EKF OK?: %s" % vehicle.ekf_ok
print "Last Heartbeat: %s" % vehicle.last_heartbeat
print "Rangefinder: %s" % vehicle.rangefinder
print "Rangefinder distance: %s" % vehicle.rangefinder.distance
print "Rangefinder voltage: %s" % vehicle.rangefinder.voltage
print "Heading: %s" % vehicle.heading
print "Is Armable?: %s" % vehicle.is_armable
print "System status: %s" % vehicle.system_status.state
print "Mode: %s" % vehicle.mode.name    # settable
print "Armed: %s" % vehicle.armed    # settable

print "\nPrint all parameters (iterate `vehicle.parameters`):"
for key, value in vehicle.parameters.iteritems():
    print " Key:%s Value:%s" % (key,value)	

#while vehicle.is_armable is False:
#	print "Is Armable?: %s" % vehicle.is_armable
vehicle.mode = VehicleMode('STABILIZE')
vehicle.armed = True

while not vehicle.armed:
	print 'Trying to arm...\n'
	time.sleep(1)

#vehicle.groundspeed = 3.2
#vehicle.airspeed = 3.2
#vehicle.simple_takeoff(10)

#channel 1 -> roll, 2 -> pitch, 3 -> throttle, 4 -> yaw
vehicle.channels.overrides['3'] = 1200
print 'throttle ' + str(vehicle.channels.overrides['3'])
print 'groundspeed, airspeed ' + str(vehicle.groundspeed) + ' ' + str(vehicle.airspeed)

time.sleep(1)
vehicle.channels.overrides['3'] = 1500
time.sleep(1)
vehicle.channels.overrides['3'] = 1100
time.sleep(1)
vehicle.channels.overrides['3'] = 1000
vehicle.channels.overrides['3'] = None

vehicle.flush()
vehicle.armed = False
