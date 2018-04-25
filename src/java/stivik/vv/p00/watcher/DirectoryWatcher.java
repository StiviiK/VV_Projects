package stivik.vv.p00.watcher;

import com.sun.nio.file.SensitivityWatchEventModifier;
import stivik.vv.p00.util.Callback;

import java.io.IOException;
import java.nio.file.*;

public class DirectoryWatcher {
    private WatchService watchService;
    private Thread watchThread;
    private Callback<Path> callback;

    private boolean interrupt = false;

    public DirectoryWatcher(Path path, Callback<Path> callable) throws IOException {
        watchService = FileSystems.getDefault().newWatchService();
        path.register(watchService, new WatchEvent.Kind[]{StandardWatchEventKinds.ENTRY_MODIFY}, SensitivityWatchEventModifier.HIGH);

        callback = callable;
        watchThread = new Thread(this::loop);
    }

    public void start() {
        interrupt = false;
        watchThread.start();
    }

    public void stop() throws InterruptedException {
        interrupt = true;
        watchThread.join();
    }

    private void loop() {
        while (!interrupt) {
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
                e.printStackTrace();
                break;
            }
        }
    }
}
