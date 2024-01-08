# NetworkUtil
Provide functions related to fetching text/json over the internet.  
The functions are splitted into 2 categories: **Asynchronous** and **Blocking**.

For the **Asynchronous** function (In here just means anything that is not marked as "Blocking"), essentially you provide a callback function that would be called after the data has been fetched. The function would perform the data fetching task in the background, without blocking the rest of code to run.  

For the **Blocking** function, it halts the entire script engine to wait for your data fetching to finish, then it returns the data (Much like a conventional function).

While Blocking function are easier to understand, it is **strongly not recommended to use Blocking functions** outside of debugging purposes, as it freezes the entire script engine while it waits for your request, halting every element that uses the scripting function in your world.

Both Blocking and Asynchronous example is provided below.

## Functions
### fetchJson(url: String, callback: Function): Object
**Asynchronous function** to return a javascript object from the url, under the assumption that the endpoint will return json. (This just calls `JSON.parse` internally)

### fetch(url: String, callback: Function): String
**Asynchronous function** to return text response from the url.

### fetchJsonBlocking(url: String): Object
**Blocking function** to return a javascript object from the url, under the assumption that the endpoint will return json. (This just calls `JSON.parse` internally)

### fetchBlocking(url: String): String
**Blocking function** to return text response from the url.

## Examples
```
    // Include NetworkUtil, make sure to replace the path with where you put your NTEUtil scripts!
    include(Resources.id("mtr:custom_directory/nteutil/NetworkUtil.js"));
    
    // Fetch our data every 60 second, globally as in this example our request are not dependent on train.
    let fetchRateLimit = new RateLimit(60);
    
    function createTrain(ctx, state, train) {
        ...
    }
    
    function renderTrain(ctx, state, train) {
        if(fetchRateLimit.shouldUpdate()) {
            /* Asynchronous! */
            NetworkUtil.fetchJson("https://api.modrinth.com/v2/statistics", (data) => {
                // Sample Data: {"projects":22383,"versions":214823,"authors":10607,"files":240823}
                print(`Did you know: Modrinth now has ${data.projects} projects created!`);
            });
            
            /* Blocking, not recommended */
            let data = NetworkUtil.fetchJsonBlocking("https://api.modrinth.com/v2/statistics");
            // Sample Data: {"projects":22383,"versions":214823,"authors":10607,"files":240823}
            print(`Did you know: Modrinth now has ${data.projects} projects created!`);
        }
    }
```