
var pmProjects = inheritance(pmItems)

pmProjects.model.name = "projects"
pmProjects.model.page_name = "project"
pmProjects.model.className = "pmProjects"

jsonEditor.options[pmProjects.model.name] = {};
pmProjects.model.selectedInventory = 0

jsonEditor.options[pmProjects.model.name]['repo_password'] = {
    type:'password',
    help:'Password from repository',
    helpcontent:'Password from repository required for GIT'
}

/**
 * Для ввода пароля
 * @type Object
 */
pmProjects.filed.selectRepositoryType = inheritance(filedsLib.filed.simpleText)
pmProjects.filed.selectRepositoryType.type = 'selectRepositoryType'
pmProjects.filed.selectRepositoryType.getValue = function(pmObj, filed){
    return '';
}


pmProjects.inventoriesAutocompletefiled = new pmInventories.filed.inventoriesAutocomplete() 


pmProjects.model.page_list = {
    buttons:[
        {
            class:'btn btn-primary',
            function:function(){ return "spajs.open({ menuId:'new-"+this.model.page_name+"'}); return false;"},
            title:'Create',
            link:function(){ return '/?new-'+this.model.page_name},
        },
    ],
    title: "Projects",
    short_title: "Projects",
    fileds:[
        {
            title:'Name',
            name:'name',
        },
        {
            title:'Status',
            name:'status',
            style:function(item){ return 'style="width: 110px"'},
            class:function(item)
            {
                if(!item || !item.id)
                {
                    return 'class="hidden-xs hidden-sm"';
                } 

                return 'class="hidden-xs hidden-sm project-status '
                    + this.model.items[item.id].justClassName('status', function(v){ return "project-status-"+v})+'"'
            },
            value:function(item, filed){
                return item.justText(filed)
            },
        }
    ],
    actions:[
        {
            class:'btn btn-default',
            function:function(item){ return 'spajs.showLoader('+this.model.className+'.syncRepo('+item.id+')); return false;'},
            title:'Sync',
            link:function(){ return '#'}
        },
        {
            // separator
        },
        {
            function:function(item){ return "spajs.open({ menuId:'project/"+item.id+"/playbook/run'}); return false;"},
            title:'Run playbook',
            link:function(){ return '#'}
        },
        {
            function:function(item){ return "spajs.open({ menuId:'project/"+item.id+"/ansible-module/run'}); return false;"},
            title:'Run ansible module',
            link:function(){ return '#'}
        },
        {
            function:function(item){ return "spajs.open({ menuId:'project/"+item.id+"/periodic-tasks'}); return false;"},
            title:'Periodic tasks',
            link:function(){ return '#'}
        },
        {
            function:function(item){ return "spajs.open({ menuId:'project/"+item.id+"/history'}); return false;"},
            title:'History',
            link:function(){ return '#'}
        },
        {
            // separator
        },
        {
            class:'btn btn-danger',
            function:function(item){ return 'spajs.showLoader('+this.model.className+'.deleteItem('+item.id+')); return false;'},
            title:'Delete',
            link:function(){ return '#'}
        },
    ]
}

pmProjects.model.page_new = {
    title: "New project",
    short_title: "New project",
    fileds:[
        [
            {
                filed: new filedsLib.filed.text(),
                title:'Name',
                name:'name',
                placeholder:'Project name',
                help:'',
                validator:function(value){
                    return filedsLib.validator.notEmpty(value, 'Name')
                },
                fast_validator:function(value){ return value != '' && value}
            },
            {
                filed: new pmProjects.filed.selectRepositoryType(),
                name:'repository',
            },
        ]
    ],
    sections:[],
    onBeforeSave:function(data)
    {
        data.repository = $("#new_project_repository").val()
        data.vars = {
            repo_type:$("#new_project_type").val(),
            repo_password:$("#new_project_password").val(),
        }

        if(!data.repository)
        {
            if(data.vars.repo_type == "MANUAL")
            {
                data.repository = "MANUAL"
            }
            else
            {
                $.notify("Invalid value in field `Repository URL`", "error");
                return false;
            }
        }

        return data;
    },
    onCreate:function(result)
    {
        var def = new $.Deferred();
        $.notify("Project created", "success");
        $.when(spajs.open({ menuId:this.model.page_name+"/"+result.id})).always(function(){
            def.resolve()
        })

        return def.promise();
    }
}

pmProjects.model.page_item = {
    buttons:[
        {
            class:'btn btn-primary',
            function:function(item_id){ return 'spajs.showLoader('+this.model.className+'.updateItem('+item_id+'));  return false;'},
            title:'Save',
            link:function(){ return '#'},
        },
        {
            class:'btn btn-warning',
            function:function(item_id){ return 'spajs.showLoader('+this.model.className+'.syncRepo('+item_id+'));  return false;'},
            title:'<i class="fa fa-refresh hidden-sm hidden-xs" aria-hidden="true"></i> Sync',
            link:function(){ return '#'},
            help:'Sync'
        },
        {
            class:'btn btn-info',
            function:function(item_id){ return 'return spajs.openURL(this.href);'},
            title:'<i class="fa fa-play hidden-sm hidden-xs" aria-hidden="true"></i> Run playbook',
            link:function(item_id){ return polemarch.opt.host +'/?project/'+ item_id + '/playbook/run'},
            help:'Run playbook'
        },
        {
            class:'btn btn-info',
            function:function(item_id){ return 'return spajs.openURL(this.href);'},
            title:'<i class="fa fa-terminal hidden-sm hidden-xs" aria-hidden="true"></i> Run module',
            link:function(item_id){ return polemarch.opt.host +'/?project/'+ item_id + '/ansible-module/run'},
            help:'Run module'
        },
        {
            class:'btn btn-info',
            function:function(item_id){ return 'return spajs.openURL(this.href);'},
            title:'<i class="fa fa-clock-o hidden-sm hidden-xs" aria-hidden="true"></i> Periodic tasks',
            link:function(item_id){ return polemarch.opt.host +'/?project/'+ item_id + '/periodic-tasks'},
            help:'Periodic tasks'
        },
        {
            class:'btn btn-info',
            function:function(item_id){ return 'return spajs.openURL(this.href);'},
            title:'<i class="fa fa-history hidden-sm hidden-xs" aria-hidden="true"></i> History',
            link:function(item_id){ return polemarch.opt.host +'/?project/'+ item_id + '/history'},
            help:'history'
        },
        {
            tpl:function(item_id){
                return spajs.just.render('pmTasksTemplates_btn_importFromFile', {item_id:item_id})
            },
        },
        {
            class:'btn btn-danger danger-right',
            function:function(item_id){ return 'spajs.showLoader('+this.model.className+'.deleteItem('+item_id+'));  return false;'},
            title:'<span class="glyphicon glyphicon-remove" ></span> <span class="hidden-sm hidden-xs" >Remove</span>',
            link:function(){ return '#'},
        },
    ],
    sections:[],
    title: function(item_id){
        return "Project "+this.model.items[item_id].justText('name')
    },
    short_title: function(item_id){
        return "Project "+this.model.items[item_id].justText('name', function(v){return v.slice(0, 20)})
    },
    fileds:[
        [
            {
                filed: new filedsLib.filed.text(),
                title:'Name',
                name:'name',
                placeholder:'Enter project name', 
                validator:function(value){
                    return filedsLib.validator.notEmpty(value, 'Name')
                },
                fast_validator:function(value){ return value != '' && value}
            },
            {
                filed: new pmProjects.filed.selectRepositoryType(),
                name:'repository',
            },
        ]
    ],
    onUpdate:function(result)
    {
        return true;
    },
    onBeforeSave:function(data, item_id)
    {
        data.repository = $("#project_"+item_id+"_repository").val()

        data.vars = {
            repo_type:$("#project_"+item_id+"_type").val(),
            repo_password:$("#project_"+item_id+"_password").val(),
        }

        if(!data.repository)
        {
            if(data.vars.repo_type == "MANUAL")
            {
                data.repository = "MANUAL"
            }
            else
            {
                $.notify("Invalid value in field `Repository URL`", "error");
                return false;
            }
        }

        return data;
    },
}

pmProjects.openItem = function(holder, menuInfo, data)
{
    var def = new $.Deferred();
    $.when(pmProjects.supportedRepos()).always(function()
    {
        $.when(pmProjects.showItem(holder, menuInfo, data)) .always(function()
        {
            def.resolve();
        })
    }).promise();

    return def.promise();
}

pmProjects.openNewItemPage = function(holder, menuInfo, data)
{
    var def = new $.Deferred();
    $.when(pmProjects.supportedRepos()).always(function()
    {
        $.when(pmProjects.showNewItemPage(holder, menuInfo, data)) .always(function()
        {
            def.resolve();
        })
    })

    return def.promise();
}

/**
 * Берёт данные со страницы  "run playbook options"  ( /?project/1/playbook/run ) для проекта и запускает выполнение Playbook
 * @returns {$.Deferred}
 */
pmProjects.executePlaybook = function(project_id)
{
    var data_vars = jsonEditor.jsonEditorGetValues();
    data_vars.limit = pmGroups.getGroupsAutocompleteValue();
    return pmTasks.execute(project_id, pmProjects.inventoriesAutocompletefiled.getValue(), $('#playbook-autocomplete').val(), data_vars);
}

/**
 * Строит страницу "run playbook options"  ( /?project/1/playbook/run ) для проекта
 * @returns {$.Deferred}
 */
pmProjects.openRunPlaybookPage = function(holder, menuInfo, data)
{
    var def = new $.Deferred();
    var thisObj = this;
    var project_id = data.reg[1]
    $.when(pmTasks.searchItems(project_id, "project"), pmProjects.loadItem(project_id), pmInventories.loadAllItems()).done(function(results)
    {
        $(holder).insertTpl(spajs.just.render(thisObj.model.name+'_run_playbook', {item_id:project_id, query:project_id}))

        //$("#inventories-autocomplete").select2({ width: '100%' });

        new autoComplete({
            selector: '#playbook-autocomplete',
            minChars: 0,
            cache:false,
            showByClick:false,
            menuClass:'playbook-autocomplete',
            renderItem: function(item, search)
            {
                return '<div class="autocomplete-suggestion" data-value="' + item.playbook + '" >' + item.playbook + '</div>';
            },
            onSelect: function(event, term, item)
            {
                $("#playbook-autocomplete").val($(item).text());
                //console.log('onSelect', term, item);
                //var value = $(item).attr('data-value');
            },
            source: function(term, response)
            {
                term = term.toLowerCase();

                var matches = []
                for(var i in results[0].results)
                {
                    var val = pmTasks.model.itemslist.results[i]
                    if(val.name.toLowerCase().indexOf(term) != -1 && val.project == project_id && val.name.toLowerCase() != term)
                    {
                        matches.push(val)
                    }
                }
                
                if(matches.length)
                {
                    response(matches);
                }
            }
        });

        def.resolve();
    }).fail(function()
    {
        def.reject();
    })

    return def.promise();
}

/**
 * @return $.Deferred
 */
pmProjects.syncRepo = function(item_id)
{
    return spajs.ajax.Call({
        url: "/api/v1/projects/"+item_id+"/sync/",
        type: "POST",
        contentType:'application/json',
        success: function(data)
        {
            $.notify("Send sync query", "success");
        },
        error:function(e)
        {
            console.warn("project "+item_id+" sync error - " + JSON.stringify(e));
            polemarch.showErrors(e.responseJSON)
        }
    });
}

/**
 * @return $.Deferred
 */
pmProjects.supportedRepos = function()
{
    return spajs.ajax.Call({
        url: "/api/v1/projects/supported-repos/",
        type: "GET",
        contentType:'application/json',
        success: function(data)
        {
            pmProjects.model.supportedRepos = data;
            pmProjects.model.repository_type = data[0]
            jsonEditor.options['projects'].repo_type = {
                type:'select',
                options:pmProjects.model.supportedRepos,
                required:true,
            }
        },
        error:function(e)
        {
            console.warn("supportedRepos error - " + JSON.stringify(e));
        }
    });
}

tabSignal.connect("polemarch.start", function()
{
    // projects
    spajs.addMenu({
        id:"projects",
        urlregexp:[/^projects$/, /^projects\/search\/?$/, /^project$/, /^projects\/page\/([0-9]+)$/],
        onOpen:function(holder, menuInfo, data){return pmProjects.showUpdatedList(holder, menuInfo, data);},
        onClose:function(){return pmProjects.stopUpdates();},
    })

    spajs.addMenu({
        id:"projects-search",
        urlregexp:[/^projects\/search\/([A-z0-9 %\-.:,=]+)$/],
        onOpen:function(holder, menuInfo, data){return pmProjects.showSearchResults(holder, menuInfo, data);}
    })

    spajs.addMenu({
        id:"project",
        urlregexp:[/^project\/([0-9]+)$/, /^projects\/([0-9]+)$/],
        onOpen:function(holder, menuInfo, data){return pmProjects.openItem(holder, menuInfo, data);}
    })

    spajs.addMenu({
        id:"newProject",
        urlregexp:[/^new-project$/],
        onOpen:function(holder, menuInfo, data){return pmProjects.openNewItemPage(holder, menuInfo, data);}
    })

    spajs.addMenu({
        id:"project-run-playbook",
        urlregexp:[/^project\/([0-9]+)\/playbook\/run$/],
        onOpen:function(holder, menuInfo, data){return pmProjects.openRunPlaybookPage(holder, menuInfo, data);}
    })

    spajs.addMenu({
        id:"project-ansible-module-run",
        urlregexp:[/^project\/([0-9]+)\/ansible-module\/run$/],
        onOpen:function(holder, menuInfo, data){return pmAnsibleModule.showInProject(holder, menuInfo, data);}
    })
})