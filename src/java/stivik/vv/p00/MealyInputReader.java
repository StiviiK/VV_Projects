package stivik.vv.p00;

import stivik.vv.p00.models.InputSymbol;
import stivik.vv.p00.models.Symbol;
import stivik.vv.p00.util.Callback;
import stivik.vv.p00.watcher.DirectoryWatcher;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class MealyInputReader implements Callback<Path> {
    private static InputSymbol parse(Path path) throws JAXBException {
        JAXBContext context = JAXBContext.newInstance(InputSymbol.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();

        return (InputSymbol) unmarshaller.unmarshal(path.toFile());
    }

    private BlockingQueue<InputSymbol> queue;
    private DirectoryWatcher watcher;

    MealyInputReader(Path inputFolder) throws IOException {
        queue = new ArrayBlockingQueue<>(10);
        watcher = new DirectoryWatcher(inputFolder, this);
    }

    public BlockingQueue<InputSymbol> getQueue() {
        return queue;
    }

    public void start() {
        watcher.start();
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
