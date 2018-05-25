package stivik.vv.p00.io;

import stivik.vv.p00.MealyStateMachine;
import stivik.vv.p00.models.InputSymbol;
import stivik.vv.p00.watcher.DirectoryWatcher;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @Purpose watches the inputFolder, parses .msg files and puts the created InputSymbols into the queue
 **/
public class MealyInputReader {
    private static final Logger LOGGER = Logger.getLogger( MealyStateMachine.class.getName() );

    // TODO: Wozu dann der Jaxb Context?
    private JAXBContext context = JAXBContext.newInstance(InputSymbol.class);

    private InputSymbol parse(Path path) throws JAXBException {
        Unmarshaller unmarshaller = context.createUnmarshaller();

        return (InputSymbol) unmarshaller.unmarshal(path.toFile());
    }

    private BlockingQueue<InputSymbol> queue;
    private DirectoryWatcher watcher;

    // TODO: Code ist nicht konsistent, sie suchen doch nach einfachen Textdateien?
    public MealyInputReader(Path inputFolder) throws IOException, JAXBException {
        queue = new ArrayBlockingQueue<>(10);
        watcher = new DirectoryWatcher(inputFolder, this::processFile);
    }

    public BlockingQueue<InputSymbol> getQueue() {
        return queue;
    }

    public void start() {
        watcher.start();
    }

    public void stop() {
        watcher.stop();
    }

    private void processFile(Path result) {
        if (result.toString().endsWith(".msg")) {
            try {
                queue.put(parse(result));
                if (!new File(result.toString()).delete()) {
                    LOGGER.log(Level.WARNING, "Failed to delete '" + result.toString() + "'");
                }
            } catch (JAXBException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
