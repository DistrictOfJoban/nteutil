importPackage(java.net);
importPackage(java.nio.charset);
importPackage(org.apache.commons.io);

const NetworkUtil = {
    fetchBlocking(url) {
        let conn = new URL(url).openConnection();
        let inputStream = conn.getInputStream();
        let str = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        return str;
    },
    fetch(url, callback) {
        java.util.concurrent.CompletableFuture.supplyAsync(() => {
            return this.fetchBlocking(url);
        }).thenAccept(val => {
            callback(val)
        });
    },
    fetchJsonBlocking(url) {
        return JSON.parse(fetchBlocking(url));
    },
    fetchJson(url, callback) {
        this.fetch(url, (str) => {
            callback(JSON.parse(str));
        })
    }
}