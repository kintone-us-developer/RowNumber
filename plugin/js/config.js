jQuery.noConflict();
(function($, PLUGIN_ID) {

    'use strict';

    // params from user specifications
    var USER = kintone.getLoginUser();
    var LANG = USER.language;

    // multi-language settings
    var terms = {
        en: {
            configTitle: 'Settings',
            pluginActivation: 'Plug-in activation',
            pluginActive: 'Active',
            kintoneFieldConfig: 'Kintone field settings',
            kintoneTableField: 'Table',
            kintoneRowNumField: 'Row Number',
            pluginSubmit: '     Save   ',
            pluginCancel: '     Cancel   ',
            textRowNum: 'Row Number (plug-in)',
            textKintoneFields: 'Please create the following fields in your app form.',
            textApiError: 'Error occurred.'
        },
        ja: {
            configTitle: '設定',
            pluginActivation: 'プラグインアクティベーション',
            pluginActive: '有効化',
            kintoneFieldConfig: 'kintoneフィールド設定',
            kintoneTableField: 'テーブル',
            kintoneRowNumField: '行数',
            pluginSubmit: '     保存   ',
            pluginCancel: 'キャンセル',
            textRowNum: 'テーブル行数 (プラグイン)',
            textKintoneFields: '次のフィールドを設定してください。',
            textApiError: 'エラー発生'
        }
    };
    var i18n = LANG in terms ? terms[LANG] : terms.en;

    // helper function: collects the fields of a certain type for a dropdown.
    var dropDownCollect = function dropDownCollect(fields, res, subRes, type) {
        //collect the table fields in the app
        for (var key in fields) {
            var field = fields[key];
            if (field.type == type) {
                var item = {
                    label: field.label || field.code,
                    code: field.code,
                    type: field.type,
                };
                res.push(item);
                //save the table's fields for later
                if (subRes) {
                    subRes[field.code] = {
                        'organized': false,
                        'fields': field.fields
                    };
                }
            }
        }
        dropDownSort(res);
    };

    // helper function: sorts a list of fields alphabetically.
    var dropDownSort = function dropDownSort(fields) {
        fields.sort(function(a, b) {
            var aa = a.label + a.code;
            var bb = b.label + b.code;
            aa = aa.toUpperCase();
            bb = bb.toUpperCase();
            if (aa < bb) {
                return -1;
            } else if (aa > bb) {
                return 1;
            }
            return 0;
        });
    };

    // append events (call in renderHtml)
    var appendEvents = function appendEvents(subTableFields) {
        // change row number dropdown options to table's fields
        $('#table-field').change(function() {
            var tableFields = subTableFields[$('#table-field').val()];
            // template & items settings
            // '#option-template' is defined in config.html
            var rowNumTemplate = $.templates(document.querySelector('#option-template'));
            var tableNumFields;
            if (tableFields.organized) {
                tableNumFields = tableFields.fields;
            } else {
                tableNumFields = [];
                dropDownCollect(tableFields.fields, tableNumFields, false, 'NUMBER');
                tableFields.organized = true;
                tableFields.fields = tableNumFields;
            }
            var rowNumItems = {
                subfields: tableNumFields
            };
            $('#rowNum-field').html(rowNumTemplate(rowNumItems));
        });

        // save plug-in settings
        $('#submit').click(function() {
            var config = {};
            config.activation = $('#activation').prop('checked') ? 'active' : 'deactive';
            config.tableField = $('#table-field').val();
            config.rowNumField = $('#rowNum-field').val();
            kintone.plugin.app.setConfig(config);
        });

        // cancel plug-in settings
        $('#cancel').click(function() {
            history.back();
        });
    };

    // create HTML (call in renderHtml)
    var createHtml = function(tableFields) {
        // template & items settings
        // '#plugin-template' is defined in config.html
        var template = $.templates(document.querySelector('#plugin-template'));
        var templateItems = {
            configTitle: i18n.configTitle,
            // section1 activate plug-in
            pluginActivation: {
                pluginActivation: i18n.pluginActivation,
                pluginActive: i18n.pluginActive
            },
            // section2 kintone fields settings
            kintoneFieldConfig: i18n.kintoneFieldConfig,
            textKintoneFields: i18n.textKintoneFields,
            kintoneFields: [{
                title: i18n.kintoneTableField,
                require: '*',
                row: '',
                id: 'table-field',
                fields: tableFields
            }, {
                title: i18n.kintoneRowNumField,
                require: '*',
                row: '',
                id: 'rowNum-field',
                fields: []
            }],
            // section3 buttons
            pluginSubmit: i18n.pluginSubmit,
            pluginCancel: i18n.pluginCancel
        };
        // render HTML
        $('#plugin-container').html(template(templateItems));
    };

    // render HTML
    var renderHtml = function() {
        kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', {
            'app': kintone.app.getId()
        }, function(resp) {
            var tableFields = [];
            var subTableFields = {};
            //collect the table fields in the app
            dropDownCollect(resp.properties, tableFields, subTableFields, 'SUBTABLE');
            //create the page
            createHtml(tableFields);
            // if previously set, set to existing values
            var config = kintone.plugin.app.getConfig(PLUGIN_ID);
            if (config) {
                $('#activation').prop('checked', config.activation === 'active');
                $('#table-field').val(config.tableField);
                $('#rowNum-field').val(config.rowNumField);
            }
            // append events
            appendEvents(subTableFields);
        });
    };

    // initiated
    $(document).ready(function() {
        renderHtml();
    });
})(jQuery, kintone.$PLUGIN_ID);
