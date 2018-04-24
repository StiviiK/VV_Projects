package stivik.vv.p00.watcher;

import stivik.vv.p00.util.Callback;

import java.io.IOException;
import java.nio.file.*;

public class DirectoryWatcher {
    private WatchService watchService;
    private Thread watchThread;
    private Callback<Path> callback;

    private boolean interrupt = false;

    public DirectoryWatcher(Path path, Callback<Path> callable) throws IOException, InterruptedException {
        watchService = FileSystems.getDefault().newWatchService();
        path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);

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
        while (true) {
            try {
                WatchKey watchKey = watchService.take();
                for (WatchEvent<?> event : watchKey.pollEvents()) {
                    Path path = (Path) event.context();
                    if (path.toString().endsWith(".msg")) {
                        callback.call(path);
                    }

                    if (!watchKey.reset()) {
                        break;
                    }
                }

                if (!interrupt) {
                    break;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
    }
}
