package stivik.vv.p00.io;

import stivik.vv.p00.models.InputSymbol;
import stivik.vv.p00.util.Callback;
import stivik.vv.p00.watcher.DirectoryWatcher;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.IOException;
import java.nio.file.Path;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class MealyInputReader implements Callback<Path> {
    private JAXBContext context = JAXBContext.newInstance(InputSymbol.class);

    private InputSymbol parse(Path path) throws JAXBException {
        Unmarshaller unmarshaller = context.createUnmarshaller();

        return (InputSymbol) unmarshaller.unmarshal(path.toFile());
    }

    private BlockingQueue<InputSymbol> queue;
    private DirectoryWatcher watcher;

    public MealyInputReader(Path inputFolder) throws IOException, JAXBException {
        queue = new ArrayBlockingQueue<>(10);
        watcher = new DirectoryWatcher(inputFolder, this);
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

    @Override
    public void call(Path result) {
        if (result.toString().endsWith(".msg")) {
            try {
                queue.put(parse(result));
            } catch (JAXBException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
