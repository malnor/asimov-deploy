/*******************************************************************************
* Copyright (C) 2012 eBay Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

define([
    "jquery",
    "marionette",
    "./deploy-unit-view",
    "app"
],
function($, Marionette, DeployUnitView, app) {

	var ChildView = Marionette.CompositeView.extend({
		itemView: DeployUnitView,
		itemViewContainer: ".deploy-unit-instance",
		template: "deploy-unit-instance",

		initialize: function() {
			this.collection = this.model.get("instances");
		}
	});


	return Marionette.CompositeView.extend({
		itemView: DeployUnitView,
		itemViewContainer: "tbody",

		template: "deploy-unit-list",

		events: {
			"click .btn-refresh": "refresh",
			"change .search-query": "filterUpdated"
		},

		initialize: function(options) {
			this.unfiltered = options.collection;
			this.collection = new this.collection.constructor(this.collection.models, this.collection.options);
			this.bindTo(this.unfiltered, "reset", this.applyFilter, this);
			this.loadFilterText();

			if (this.collection.length > 0) {
				this.applyFilter();
			}
		},

		refresh: function(e) {
			$(e.target).button("loading");

			this.unfiltered.fetch()
				.always(function() {
					$(e.target).button("reset");
				});
		},

		applyFilter: function() {

			var regEx = new RegExp(this.filterText, 'i');

			this.collection.reset(this.unfiltered.filter(function(item) {
				return regEx.exec(item.get('unitName')) !== null || regEx.exec(item.get('agentName')) !== null;
			}));
		},

		filterUpdated: function(e) {
			this.filterText = $(e.target).val();
			this.saveLoadFilterText();
			this.applyFilter();
		},

		serializeData: function() {
			return { filterText: this.filterText };
		},

		saveLoadFilterText: function() {
			if (localStorage) {
				localStorage.setItem('DeployUnitView:filter', this.filterText);
			}
		},

		loadFilterText: function() {
			this.filterText = "";

			if (localStorage) {
				var storedFilter = localStorage.getItem('DeployUnitView:filter');
				if (storedFilter) {
					this.filterText = storedFilter;
				}
			}

		}

	});

});