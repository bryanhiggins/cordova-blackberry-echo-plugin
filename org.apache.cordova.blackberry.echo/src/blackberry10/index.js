/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var echo;

module.exports = {
    //Note this is named identically to the request from client.js
    echo: function (success, fail, args, env) {
        //PluginResult object is used to send data back to the client.js file.
        //It must repond using one of
        //    result.ok(data, keepCallbacks)
        //    result.error(errorMsg, keepCallbacks)
        //    result.noResult(keepCallbacks)
        //For sending data back after the initial response (like in a callback)
        //You can use one of the following
        //    result.callbackOK(data, keepCallbacks)
        //    result.callbackError(errorMsg, keepCallbacks)
        var result = new PluginResult(args, env),
            //All arguments are stringified and encoded when sent from the client.js file
            data = JSON.parse(decodeURIComponent(args.data)),
            response = echo.getInstance().echo(data);
        result.ok(response, false);
    }
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin
///////////////////////////////////////////////////////////////////

JNEXT.Echo = function () {
    var self = this,
        hasInstance = false;

    self.echo = function (text) {
        //This is how Javascript calls into native
        return JNEXT.invoke(self.m_id, "echo " + text);
    };

    self.init = function () {
        //Checks that the jnext library is present and loads it
        if (!JNEXT.require("libecho")) {
            return false;
        }

        //Creates the native object that this interface will call
        self.m_id = JNEXT.createObject("libecho.Echo");

        if (self.m_id === "") {
            return false;
        }

        //Registers for the JNEXT event loop
        JNEXT.registerEvents(self);
    };

    self.m_id = "";

    //Used by JNEXT library to get the ID
    self.getId = function () {
        return self.m_id;
    };

    //Not truly required but useful for instance management
    self.getInstance = function () {
        if (!hasInstance) {
            self.init();
            hasInstance = true;
        }
        return self;
    };
};

echo = new JNEXT.Echo();
