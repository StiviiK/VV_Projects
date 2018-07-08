package stivik.vv.p02;

import org.apache.activemq.ActiveMQConnectionFactory;
import stivik.vv.p02.communitcator.ActiveMQCommunicator;
import stivik.vv.p02.communitcator.targets.ActiveMQTarget;
import stivik.vv.p02.models.TelematicMessage;

import javax.jms.JMSException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DataWarehouse implements Runnable {
    private static final Logger LOGGER = Logger.getLogger(DataWarehouse.class.getName());

    private ActiveMQCommunicator communicator;
    private ActiveMQTarget<TelematicMessage> messageTopic;

    private Map<Integer, Integer[]> data;
    private Calendar calendar;

    private boolean running = true;

    public DataWarehouse(String listeningTopic) throws JMSException {
        communicator = new ActiveMQCommunicator(ActiveMQConnectionFactory.DEFAULT_BROKER_URL);
        messageTopic = communicator.topicTarget(TelematicMessage.class, listeningTopic);

        data = new HashMap<>();
        calendar = Calendar.getInstance();
    }

    @Override
    public void run() {
        try {
            while(running) {
                TelematicMessage message = messageTopic.receive();

                calendar.setTimeInMillis(message.getTime());
                int hour = calendar.get(Calendar.HOUR_OF_DAY);

                Integer[] array = data.computeIfAbsent(message.getUnitId(), k ->
                            new Integer[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        );
                array[hour] += message.getDistance();

                LOGGER.log(Level.INFO, String.format("Driven distance of hour %d of unit %d: %d", hour, message.getUnitId(), array[hour]));
            }
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        try {
            new Thread(new DataWarehouse("verteiler")).start();
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
