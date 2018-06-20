jQuery.noConflict();
(function ($, PLUGIN_ID) {
    "use strict";

    // plug-in config
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);
    // activation
    if (config && config.activation !== 'active') {
        return;
    }

    // params for setting fields
    var TEXT_FIELD = config.textField;
    var CHAR_COUNT_FIELD = config.charCountField;

    var CHANGE_EVENTS = ['app.record.create.change.' + TEXT_FIELD, 'app.record.edit.change.' + TEXT_FIELD,'app.record.index.edit.change.' + TEXT_FIELD];
    var EDIT_EVENTS = ['app.record.edit.show', 'app.record.create.show', 'app.record.index.edit.show'];

    //The character count field should be updated as the user types into a field.
    //At the moment, it only updates when the user presses the ENTER key.
    kintone.events.on(CHANGE_EVENTS, function(event) {
        var text = event.changes.field.value;
        text = text.replace(/\s+/g, "");
        event.record[CHAR_COUNT_FIELD].value = text.length;
        return event;
    });

    //Users should not be able to directly edit the character count field.
    kintone.events.on(EDIT_EVENTS, function (event) {
        event.record[CHAR_COUNT_FIELD].disabled = true;
        return event;
    });
})(jQuery, kintone.$PLUGIN_ID);
