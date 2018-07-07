package stivik.vv.p02;

import java.util.Random;

import org.apache.activemq.ActiveMQConnection;
import stivik.vv.p02.helper.ActiveMQCommunicator;
import stivik.vv.p02.models.GPSPosition;

import javax.jms.JMSException;

public class TelematicsUnit implements Runnable {
    private static int lastId = 0;


    private final int unitId = ++lastId;
    private int sendInterval;
    private Random random = new Random();
    private boolean running = true;

    private ActiveMQCommunicator<TelematicMessage> communicator;
    private static String url = ActiveMQConnection.DEFAULT_BROKER_URL;
    private static String queue = "fahrdaten";


    public TelematicsUnit(int intervalInMS) throws JMSException {
        sendInterval = intervalInMS;
        communicator = new ActiveMQCommunicator<>(TelematicMessage.class, url, queue);
    }

    @Override
    public void run() {
        try {
            while(running) {
                communicator.send(
                        new TelematicMessage(
                                unitId,
                                random.nextInt(10000),
                                System.currentTimeMillis(),
                                GPSPosition.getRandom()
                        )
                );

                TelematicMessage msg = communicator.receive();
                System.out.println(msg.getUnitId());

                Thread.sleep(sendInterval);
            }

            communicator.close();
        } catch (InterruptedException | JMSException e) {
            e.printStackTrace();
        }
    }

    public int getUnitId() {
        return unitId;
    }

    public static void main(String[] args) {
        try {
            TelematicsUnit units[] = {
                new TelematicsUnit(2000)
            };


            for (TelematicsUnit unit : units) {
                new Thread(unit).start();
            }
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
