importPackage(java.io);
importPackage(java.nio.file);

const map = new Map();
const random = new java.util.Random();

let watchService;

const FileWatcher = {
    watch(file, callback) {
        if(watchService == null) {
            watchService = FileSystems.getDefault().newWatchService()
        }
        
        let path = new File(file).getParentFile().toPath();
        let id = random.nextLong();
        
        path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_MODIFY, StandardWatchEventKinds.ENTRY_DELETE);
        map.set(id, {
            fileName: new File(file).getName(),
            callback: callback
        });
        return id;
    },
    tick() {
        let wk = watchService.poll();
        if(wk != null) {
            for(let watchEvent of wk.pollEvents()) {
                let mode;
                if(watchEvent.kind() == StandardWatchEventKinds.ENTRY_CREATE) {
                    mode = 1;
                } else if(watchEvent.kind() == StandardWatchEventKinds.ENTRY_MODIFY) {
                    mode = 0;
                } else {
                    mode = -1;
                }
                let affectedFileName = watchEvent.context();
                for(let m of map.values()) {
                    if(m.fileName == String(affectedFileName)) {
                        m.callback(mode);
                    }
                }
            }
            wk.reset();
        }
    },
    stopWatching(id) {
        map.delete(id);
        if(map.size == 0) {
            watchService.close();
            watchService = null;
        }
    }
}