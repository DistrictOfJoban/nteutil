# NetworkUtil
Provide functions related to fetching text/json over HTTP.  

As fetching data over the network takes time (And is unpredictable), it is generally a bad idea to directly fetch the data on the currently executing JS thread, as it means *now the entire script engine and all element in the world utilizing NTE Script will now wait for your single network request to finish before continuing*

As such, a callback function is used. When you pass in a function as a parameter, NetworkUtil will automatically fetch the data in the background while the rest of the script continues to work.  
Once the data is fetched, it will call your callback function with the corresponding data.

An example on how to use it could be found below.

*Tips: Always remember to set a RateLimit, you do not want to send 60 http request every single second*

## Functions
### fetchJson(url: String, callback: Function): Object
Returns a javascript object from the url via the callback function, under the assumption that the endpoint will return json. (This just calls `JSON.parse` internally)

### fetch(url: String, callback: Function): String
Returns a plain text response from the url via the callback function.

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
            // First parameter is the url 
            // The second parameter is an arrow function, taking a "data" variable.
            // This most is the same as function(data) {...}, but just looks more elegant
            NetworkUtil.fetchJson("https://api.modrinth.com/v2/statistics", (data) => {
                // We now have our data!
                // Sample Data: {"projects":22383,"versions":214823,"authors":10607,"files":240823}
                print(`Did you know: Modrinth now has ${data.projects} projects created!`);
            });
        }
    }
```