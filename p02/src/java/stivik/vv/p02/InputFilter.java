package stivik.vv.p02;

import org.apache.activemq.ActiveMQConnectionFactory;
import stivik.vv.p02.communitcator.ActiveMQCommunicator;
import stivik.vv.p02.communitcator.targets.ActiveMQTarget;
import stivik.vv.p02.models.AlarmMessage;
import stivik.vv.p02.models.TelematicMessage;

import javax.jms.JMSException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class InputFilter implements Runnable {
    private static final Logger LOGGER = Logger.getLogger(InputFilter.class.getName());

    private ActiveMQCommunicator communicator;
    private ActiveMQTarget<TelematicMessage> messageQueue;
    private ActiveMQTarget<TelematicMessage> alarmQueue;
    private ActiveMQTarget<TelematicMessage> messageTopic;

    private boolean running = true;

    public InputFilter(String listeningQueue, String targetTopic, String alarms) throws JMSException {
        communicator = new ActiveMQCommunicator(ActiveMQConnectionFactory.DEFAULT_BROKER_URL);
        messageQueue = communicator.queueTarget(TelematicMessage.class, listeningQueue);
        alarmQueue = communicator.queueTarget(TelematicMessage.class, alarms);
        messageTopic = communicator.topicTarget(TelematicMessage.class, targetTopic);
    }

    @Override
    public void run() {
        try {
            while (running) {
                processMessage(messageQueue.receive());
            }

            communicator.close();
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }

    public void stop() {
        running = false;
    }

    private void processMessage(TelematicMessage message) throws JMSException {
        if(message instanceof AlarmMessage) {
            alarmQueue.send(message);
            LOGGER.log(Level.INFO, String.format("Proccessed alarm message: %s", message));

            return;
        }

        messageTopic.send(message);
        LOGGER.log(Level.INFO, String.format("Proccessed message: %s", message));
    }

    public static void main(String[] args) {
        try {
            new Thread(new InputFilter("fahrdaten", "verteiler", "alarme")).start();
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
