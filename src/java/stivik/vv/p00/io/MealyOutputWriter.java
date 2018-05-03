package stivik.vv.p00.io;

import stivik.vv.p00.models.OutputSymbol;
import stivik.vv.p00.models.Symbol;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import java.io.File;
import java.nio.file.Path;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

/**
 * @Purpose waits for object in the blocking queue and writes them as XML file to the outputFolder
 **/
public class MealyOutputWriter {
    private Path outputPath;
    private JAXBContext context = JAXBContext.newInstance(OutputSymbol.class);
    private BlockingQueue<Symbol> queue;
    private Thread writer;

    public MealyOutputWriter(Path outputFolder) throws JAXBException {
        outputPath = outputFolder;
        queue = new ArrayBlockingQueue<>(10);
        writer = new Thread(this::run);
    }

    public BlockingQueue<Symbol> getQueue() {
        return queue;
    }

    public void start() {
        writer.start();
    }

    public void stop() {
        writer.interrupt();
    }

    private void run() {
        while(true) {
            try {
                Symbol symbol = queue.take();
                write(new OutputSymbol(symbol), symbol.getName());
            } catch (InterruptedException ignored) {
                break;
            }
        }
    }

    private void write(OutputSymbol symbol, String symbolName) {
        try {
            Marshaller marshaller = context.createMarshaller();
            marshaller.marshal(symbol, new File(outputPath.toString(), symbolName + ".msg"));
        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }
}
