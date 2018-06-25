jQuery.noConflict();
(function ($, PLUGIN_ID) {
    "use strict";

    // plug-in config
var config = kintone.plugin.app.getConfig(PLUGIN_ID);
if(config&&config.activation != 'active'){
  return;
}

var rowsField = config.rowNumField;
var tableField = config.tableField;


var load=['app.record.edit.show',
          'app.record.create.show',
          'app.record.index.edit.show'];

var rowsChange=['app.record.create.change.'+tableField,
                'app.record.edit.change.'+tableField,
                'app.record.index.edit.change.'+tableField];

var editRecord=['app.record.edit.show'];


kintone.events.on(editRecord,function(event){
  var numberOfRows=event.record[tableField].value;
  for(var i=0; i<=numberOfRows.length-1; i++){
    numberOfRows[i].value[rowsField].disabled=true;
  }
  return event;
});

kintone.events.on(load, function (event) {
var rows = event.record[tableField].value;
var forceDefaultValue=rows[0].value[rowsField].value=1;
rows[0].value[rowsField].value=forceDefaultValue;
rows[0].value[rowsField].disabled=true;

return event;
});

kintone.events.on(rowsChange,function(event){
 var numberOfRows=event.record[tableField].value;
 numberOfRows[0].value[rowsField].value=1;
 for(var i=1;i<=numberOfRows.length-1;i++){
  numberOfRows[i].value[rowsField].value=i+1;
  numberOfRows[i].value[rowsField].disabled=true;
 }

  return event;
});

})(jQuery, kintone.$PLUGIN_ID);
