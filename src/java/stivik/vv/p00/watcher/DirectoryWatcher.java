package stivik.vv.p00.watcher;

import stivik.vv.p00.util.Callback;

import com.sun.nio.file.SensitivityWatchEventModifier;
import java.io.IOException;
import java.nio.file.*;

public class DirectoryWatcher {
    private WatchService watchService;
    private Thread watchThread;
    private Callback<Path> callback;

    public DirectoryWatcher(Path path, Callback<Path> callable) throws IOException {
        watchService = FileSystems.getDefault().newWatchService();
        path.register(watchService, new WatchEvent.Kind[]{StandardWatchEventKinds.ENTRY_MODIFY}, SensitivityWatchEventModifier.HIGH);

        callback = callable;
        watchThread = new Thread(this::loop);
    }

    public void start() {
        watchThread.start();
    }

    public void stop() {
        watchThread.interrupt();
    }

    private void loop() {
        while (true) {
            try {
                WatchKey watchKey = watchService.take();
                Path dir = (Path) watchKey.watchable();

                for (WatchEvent<?> event : watchKey.pollEvents()) {
                    if (event.kind() == StandardWatchEventKinds.OVERFLOW) {
                        continue;
                    }

                    callback.call(dir.resolve((Path) event.context()));
                }
                watchKey.reset();
            } catch (InterruptedException e) {
                System.out.println(e.getMessage());
                break;
            }
        }
    }
}
