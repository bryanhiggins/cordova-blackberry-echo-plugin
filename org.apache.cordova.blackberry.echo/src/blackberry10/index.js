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
    echo: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
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
        return JNEXT.invoke(self.m_id, "echo " + text);
    };

    self.init = function () {
        if (!JNEXT.require("libecho")) {
            return false;
        }

        self.m_id = JNEXT.createObject("libecho.Echo");

        if (self.m_id === "") {
            return false;
        }

        JNEXT.registerEvents(self);
    };

    self.m_id = "";

    self.getInstance = function () {
        if (!hasInstance) {
            self.init();
            hasInstance = true;
        }
        return self;
    };
};

echo = new JNEXT.Echo();
