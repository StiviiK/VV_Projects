package stivik.vv.p02;

import org.apache.activemq.ActiveMQConnectionFactory;
import stivik.vv.p02.communitcator.ActiveMQCommunicator;
import stivik.vv.p02.communitcator.targets.ActiveMQTarget;
import stivik.vv.p02.models.GPSPosition;
import stivik.vv.p02.models.TelematicMessage;

import javax.jms.JMSException;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TelematicsUnit implements Runnable {
    private static final Logger LOGGER = Logger.getLogger(TelematicsUnit.class.getName());
    private static int lastId = 0;


    private final int unitId = ++lastId;
    private int sendInterval;
    private Random random = new Random();
    private boolean running = true;

    private ActiveMQCommunicator communicator;
    private ActiveMQTarget<TelematicMessage> messageQueue;


    public TelematicsUnit(String queue, int intervalInMS) throws JMSException {
        sendInterval = intervalInMS;
        communicator = new ActiveMQCommunicator(ActiveMQConnectionFactory.DEFAULT_BROKER_URL);
        messageQueue = communicator.queueTarget(TelematicMessage.class, queue);
    }

    @Override
    public void run() {
        try {
            while(running) {
                TelematicMessage message = new TelematicMessage(
                        unitId,
                        random.nextInt(1000),
                        System.currentTimeMillis(),
                        GPSPosition.getRandom()
                );
                messageQueue.send(message);

                LOGGER.log(Level.INFO, String.format("Sent message: %s", message));

                Thread.sleep(sendInterval);
            }

            communicator.close();
        } catch (InterruptedException | JMSException e) {
            e.printStackTrace();
        }
    }

    public void stop() {
        running = false;
    }

    public static void main(String[] args) {
        try {
            TelematicsUnit units[] = {
                new TelematicsUnit("fahrdaten", 500),
                new TelematicsUnit("fahrdaten", 500),
            };


            for (TelematicsUnit unit : units) {
                new Thread(unit).start();
            }
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
