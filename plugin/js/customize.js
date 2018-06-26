jQuery.noConflict();
(function ($, PLUGIN_ID) {
  "use strict";

  // plug-in config
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if(config&&config.activation != 'active'){
    return;
  }

  var tableField = config.tableField;
  var rowNumField = config.rowNumField;

  var LOAD_EVENTS = ['app.record.create.show',
                     'app.record.edit.show',
                     'app.record.index.edit.show'];

  var ROW_CHANGE_EVENTS = ['app.record.create.change.' + tableField,
                           'app.record.edit.change.' + tableField,
                           'app.record.index.edit.change.' + tableField];

  kintone.events.on(LOAD_EVENTS, function(event) {
    var rows = event.record[tableField].value;
    //first row is always row 1.
    rows[0].value[rowNumField].value = 1;
    //When a record is loaded, we have to disable all the current row numbers.
    for (var i = 0; i < rows.length; i++) {
      rows[i].value[rowNumField].disabled = true;
    }
    return event;
  });

  kintone.events.on(ROW_CHANGE_EVENTS, function(event) {
    //Any new rows added must have their row number disabled.
    if (event.changes.row) {
      event.changes.row.value[rowNumField].disabled = true;
    }
    //then simply re-number the rows.
    var numberOfRows = event.record[tableField].value.length;
    for (var i = 0; i < numberOfRows; i++) {
      event.record[tableField].value[i].value[rowNumField].value = i + 1;
    }
    return event;
  });

})(jQuery, kintone.$PLUGIN_ID);
