const {ipcRenderer} = require('electron')

$(document).ready(function () {


	$("#btn_refrseh_data").on('click', function () {
		ipcRenderer.send('refresh-data-start', 'ping');
		$("#data-update-results").html("");
		$("#data-update-results").show();
	});

	ipcRenderer.on('refresh-data-updated', (event, arg) => {
		console.log(arg); // prints "pong"
		$("#data-update-results").append(arg + "<br>");
	});

	var LessonCategories = "";

	let tree = $('.js-dropdown-tree');

	// generate tree from array of objects
	function generateTree(arr, listItem) {
		listItem.append('<ul></ul>');
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].children !== undefined && arr[i].children.length > 0) {
				listItem.children('ul').append('<li><div class="dropdown-tree__item" data-catid="' + arr[i].id + '"><span class="dropdown-tree__item-line"></span>' + arr[i].name + '</div></li>');
				generateTree(arr[i].children, listItem.children('ul').children('li').eq(i));
			}
			else {
				listItem.children('ul').append('<li><div class="dropdown-tree__item" data-catid="' + arr[i].id + '"><span class="dropdown-tree__item-line"></span>' + arr[i].name + '</div></li>');
			}
		}
	}

	// show on focus
	tree.siblings('input').click(function () {
		tree.fadeIn(300);
	});

	// hide on click out of box
	$(document).on('click touchstart', function (e) {
		if (!$(e.target).closest(tree.parent()).length) {
			tree.fadeOut(300);
		}
	});

	// check parent nodes
	function addClassToParentsNode(element, cls) {
		let list = element.parents('li').children('.dropdown-tree__item');
		list.each(function (index) {
			if (!list.eq(index).hasClass(cls)) {
				list.eq(index).addClass(cls);
			}
		});
	}

	// recursively go to next parent item and clear check
	function removeClassFromParentNode(element, cls) {
		let list = element.closest('ul').parent('li').children('ul').find('.' + cls);
		if (!list.length && element.length) {
			element.closest('ul').parent('li').children('.dropdown-tree__item').removeClass(cls);
			removeClassFromParentNode(element.closest('ul').parent('li').children('.dropdown-tree__item'), cls);
		}
	}

	function getChildrenList(element) {
		return element.parent('li').find('ul');
	}

	// check children
	function addClassToChildrens(element, cls) {
		let list = getChildrenList(element);
		if (list.length) {
			list.each(function (index) {
				if (!list.eq(index).children('li').children('.dropdown-tree__item').hasClass(cls)) {
					list.eq(index).children('li').children('.dropdown-tree__item').addClass(cls);
				}
			});
		}
	}

	// remove check from children
	function removeClassFromChildrens(element, cls) {
		let list = getChildrenList(element);
		if (list.length) {
			list.each(function (index) {
				if (list.eq(index).children('li').children('.dropdown-tree__item').hasClass(cls)) {
					list.eq(index).children('li').children('.dropdown-tree__item').removeClass(cls);
				}
			});
		}
	}

	// click on label, checkbox
	tree.on('click', '.dropdown-tree__item', function () {
		if (!$(this).hasClass('checked')) {
			addClassToParentsNode($(this), 'checked');
			addClassToChildrens($(this), 'checked');
		}
		else {
			$(this).removeClass('checked');
			removeClassFromChildrens($(this), 'checked');
			removeClassFromParentNode($(this), 'checked');
		}
	});

	// disable tree buttons
	function disableTreeButtons(time) {
		let list = tree.find('.dropdown-tree__btn');
		list.each(function (index) {
			list.eq(index).addClass('disabled');
			setTimeout(function () {
				list.eq(index).removeClass('disabled');
			}, time);
		});
	}

	// cancel button
	function cancelAll() {
		let opened = tree.find('.children-show'),
			checked = tree.find('.checked');

		opened.each(function (index) {
			opened.eq(index).children('ul').removeAttr('style');
			opened.eq(index).removeClass('children-show');
		});

		checked.each(function (index) {
			checked.eq(index).removeClass('checked');
		});
	}

	tree.find('.btn--cancel').click(function () {
		cancelAll();
	});

	// apply button
	tree.find('.btn--apply').click(function () {
		let checkedList = tree.find('.checked'),
			result = [];

		LessonCategories = "-";
		checkedList.each(function (index) {
			LessonCategories += checkedList.eq(index).data("catid") + "-";
			result.push(checkedList.eq(index).text());
		});

		tree.siblings('input').val(result.join(','));
		tree.fadeOut(300);
	});


	const sort_by = (field, reverse, primer) => {

		const key = primer ?
			function (x) {
				return primer(x[field])
			} :
			function (x) {
				return x[field]
			};

		reverse = !reverse ? 1 : -1;

		return function (a, b) {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		}
	}

	function list_to_tree(list) {
		var map = {}, node, roots = [], i;

		for (i = 0; i < list.length; i += 1) {
			map[list[i].id] = i; // initialize the map
			list[i].children = []; // initialize the children
		}

		for (i = 0; i < list.length; i += 1) {
			node = list[i];
			if (node.parentID !== "0") {
				// if you have dangling branches check that map[node.parentId] exists
				list[map[node.parentID]].children.push(node);
			}
			else {
				roots.push(node);
			}
		}
		return roots;
	}

	setTimeout(function () {
		$.ajax({
			url: "./categories.json",
			method: 'get',
			dataType: 'json',
			error: function (data) {
				console.log("ERROR");
				console.log(data);
			},
			success: function (data) {

				data.sort(sort_by('fullpath', false, (a) => a.toUpperCase()));

				// console.log(data);
				// console.log( list_to_tree(data) );

				generateTree(list_to_tree(data), tree.children('.dropdown-tree__content'));

				// slide children lists
				// append slide button to lists
				let listItems = tree.find('li');
				listItems.each(function (index) {
					if (listItems.eq(index).children('ul').length) {
						listItems.eq(index).append('<div class="dropdown-tree__btn"></div>');
					}
				});

				listItems.children('.dropdown-tree__btn:first').first().parent().addClass('children-show');

				listItems.children('.dropdown-tree__btn').click(function () {
					if ($(this).parent().hasClass('children-show')) {
						$(this).parent().removeClass('children-show');
						disableTreeButtons(300);
					}
					else {
						$(this).parent().addClass('children-show');
						disableTreeButtons(300);
					}
				});
			}
		});
	}, 1000);

	$.ajax({
		url: "./lesson.json",
		method: 'get',
		dataType: 'json',
		error: function (data) {
			console.log("ERROR");
			console.log(data);
		},
		success: function (data) {
			console.log(data);
			console.log(data.length);
			for (var i = 0; i < data.length; i++) {
				console.log(data[i]);

				var LessonBox = `<div class="col-lg-6 col-md-6 mb-4" id="lesson_${data[i].id}" data-screen_path="${data[i].screen_path}"  data-checkboxes_query="${data[i].checkboxes_query}">
              <div class="card h-100">
              <div class="card-img-top" style="max-height:200px;" >
                <img src="${data[i].picture}" alt="" style="max-height: 200px">
                </div>
                <div class="card-body">
                  <h4 class="card-title">${data[i].name}</h4>
                  <p class="card-text">${data[i].description}</p>
                  <br>
                    <div class="select">
                  <select  class="selectNative js-selectNative" aria-labelledby="jobLabel" id="select_lesson_${data[i].id}">
                  </select></div>
                    <div class="select">
                  <select  class="selectNative js-selectNative" aria-labelledby="jobLabel" id="options_lesson_${data[i].id}">
                  </select></div>
                    <div class="select">
                  <select  class="selectNative js-selectNative" aria-labelledby="jobLabel" id="options2_lesson_${data[i].id}">
                  </select></div>
                    <div class="select">
                  <select  class="selectNative js-selectNative" aria-labelledby="jobLabel" id="options3_lesson_${data[i].id}">
                  </select></div>
                  <div id="checkbox_${data[i].id}"></div>
                  </div>
                  <div class="card-footer">`;

				LessonBox += `<span class="btn btn-primary screen_button" data-lesson_id="lesson_${data[i].id}" style="cursor: pointer;">Screen</span>
                  </div>
                </div>
              </div>`;


				$("#lessons_row").append(LessonBox);

				if (typeof data[i].lessons !== "undefined") {
					var Options = "";
					if (typeof data[i].lessons !== "undefined") {
						for (var j = 0; j < data[i].lessons.length; j++) {
							$("#select_lesson_" + data[i].id).append("<option data-query='" + data[i].lessons[j].query + "' data-value='" + data[i].lessons[j].value + "' value='" + data[i].lessons[j].query + "#" + data[i].lessons[j].value + "'>" + data[i].lessons[j].name + "</option>");
						}
					}
				}
				else {
					$("#select_lesson_" + data[i].id).hide();
				}

				if (typeof data[i].options !== "undefined") {
					var Options = "";
					if (typeof data[i].options !== "undefined") {
						for (var j = 0; j < data[i].options.length; j++) {
							$("#options_lesson_" + data[i].id).append("<option data-query='" + data[i].options[j].query + "' data-value='" + data[i].options[j].value + "' value='" + data[i].options[j].query + "#" + data[i].options[j].value + "'>" + data[i].options[j].name + "</option>");
						}
					}
				}
				else {
					$("#options_lesson_" + data[i].id).hide();
				}

				if (typeof data[i].options2 !== "undefined") {
					var Options2 = "";
					if (typeof data[i].options2 !== "undefined") {
						for (var j = 0; j < data[i].options2.length; j++) {
							$("#options2_lesson_" + data[i].id).append("<option data-query='" + data[i].options2[j].query + "' data-value='" + data[i].options2[j].value + "' value='" + data[i].options2[j].query + "#" + data[i].options2[j].value + "'>" + data[i].options2[j].name + "</option>");
						}
					}
				}
				else {
					$("#options2_lesson_" + data[i].id).hide();
				}

				if (typeof data[i].options3 !== "undefined") {
					var Options3 = "";
					if (typeof data[i].options3 !== "undefined") {
						for (var j = 0; j < data[i].options3.length; j++) {
							$("#options3_lesson_" + data[i].id).append("<option data-query='" + data[i].options3[j].query + "' data-value='" + data[i].options3[j].value + "' value='" + data[i].options3[j].query + "#" + data[i].options3[j].value + "'>" + data[i].options3[j].name + "</option>");
						}
					}
				}
				else {
					$("#options3_lesson_" + data[i].id).hide();
				}

				if (typeof data[i].checkboxes !== "undefined") {
					for (var j = 0; j < data[i].checkboxes.length; j++) {
						$("#checkbox_" + data[i].id).append("<div class=\"form-check form-check-inline\">" +
							"<input class=\"form-check-input checkbox_lesson_" + data[i].id + "\" type=\"checkbox\" id=\"inlineCheckbox" + data[i].checkboxes[j].value + "\" value=\"" + data[i].checkboxes[j].value + "\">" +
							"  <label class=\"form-check-label\" for=\"inlineCheckbox" + data[i].checkboxes[j].value + "\">" + data[i].checkboxes[j].name + "</label>" +
							"</div>");
					}
				}

				$(".screen_button").off('click').on("click", function () {
					var LessonParameters = {};
					var CheckBoxQuery = "";
					var HasCheckBox = false;
					if ($("#" + $(this).data("lesson_id")).data("checkboxes_query") !== "undefined") {
						var heckBoxQueryLeft = $("#" + $(this).data("lesson_id")).data("checkboxes_query");
						$("input:checkbox.checkbox_" + $(this).data("lesson_id")).each(function () {
							console.log(this.checked ? $(this).val() : "");
							CheckBoxQuery += (this.checked ? $(this).val() : "");
							HasCheckBox = true;
						});
						LessonParameters[heckBoxQueryLeft] = CheckBoxQuery;
					}

					var DropDownQuery = $("#select_" + $(this).data("lesson_id")).find(":selected").data("query");
					var DropDownValue = $("#select_" + $(this).data("lesson_id")).find(":selected").data("value");

					if (typeof DropDownQuery !== "undefined") {
						LessonParameters[DropDownQuery] = DropDownValue;
					}

					var DropDownQuery = $("#options_" + $(this).data("lesson_id")).find(":selected").data("query");
					var DropDownValue = $("#options_" + $(this).data("lesson_id")).find(":selected").data("value");

					if (typeof DropDownQuery !== "undefined") {
						LessonParameters[DropDownQuery] = DropDownValue;
					}

					var DropDownQuery = $("#options2_" + $(this).data("lesson_id")).find(":selected").data("query");
					var DropDownValue = $("#options2_" + $(this).data("lesson_id")).find(":selected").data("value");

					if (typeof DropDownQuery !== "undefined") {
						LessonParameters[DropDownQuery] = DropDownValue;
					}

					var DropDownQuery = $("#options3_" + $(this).data("lesson_id")).find(":selected").data("query");
					var DropDownValue = $("#options3_" + $(this).data("lesson_id")).find(":selected").data("value");

					if (typeof DropDownQuery !== "undefined") {
						LessonParameters[DropDownQuery] = DropDownValue;
					}

					LessonParameters["category"] = LessonCategories;

					console.log( LessonParameters );

					var ScreenPath = $("#" + $(this).data("lesson_id")).data("screen_path");
					ipcRenderer.send('set-lesson-parameters', LessonParameters);
					ipcRenderer.send('load-lesson', ScreenPath);
//					window.open(ScreenPath + QueryExtra, '_blank', 'nodeIntegration=yes');
				});
			}
		}

	});
});
