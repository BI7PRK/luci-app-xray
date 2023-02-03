/**
 * @license
 * Copyright 2022 BI7PRK
 *
 * Licensed to the public under the MIT License.
 */
"use strict";"require form";return L.view.extend({render:function(){var e=new form.Map("xray","%s - %s".format(_("XRay"),_("Observatory")),_("Details: %s").format('<a href="https://www.v2fly.org/config/observatory.html#observatoryobject" target="_blank">ObservatoryObject</a>')),r=e.section(form.NamedSection,"main_observatory","observatory");return r.addremove=!1,r.option(form.Flag,"enabled",_("Enabled")).rmempty=!1,r.option(form.Value,"probeURL",_("ProbeURL"),_("A valid URL, it will be get request to testing. eg: <code>%s</code>.").format("https://www.gstatic.com/generate_204")).placeholder=_("empty use the built-in value"),r.option(form.Value,"probeInterval",_("ProbeInterval")),r.option(form.DynamicList,"subjectSelector",_("SubjectSelector")),e.render()}});