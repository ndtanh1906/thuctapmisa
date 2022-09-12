class EmployeePage {
    // Hàm khởi tạo
    constructor(gridId) {
        let me = this;

        // Lưu lại grid đang thao tác
        me.grid = $(`#${gridId}`);
        // Dùng khởi tạo sự kiện
        me.initEvents();

        // KHởi tạo form detail
        me.initFormDetail();
        // Lấy ra cấu hình các cột
        me.columnConfig = me.getColumnConfig();

        // Lấy dữ liệu
        me.getDataEmployee();
        me.getDataDepartment();
        me.getDataPosition();
    }

    /**
     * Lấy config các cột
     * @returns
     */
    getColumnConfig() {
        let me = this,
            columnDefault = {
                FieldName: "",
                DataType: "String",
                EnumName: "",
                Text: "",
            },
            columns = [];

        // Duyệt từng cột để vẽ header
        me.grid.find(".col").each(function () {
            let column = { ...columnDefault },
                that = $(this);

            Object.keys(columnDefault).filter(function (proName) {
                let value = that.attr(proName);

                if (value) {
                    column[proName] = value;
                }

                column.Text = that.text();
            });

            columns.push(column);
        });

        return columns;
    }

    /**
     * Dùng để khởi tạo các sự kiện cho trang
     */
    initEvents() {
        let me = this;

        // Khởi tạo sự kiện thêm nhân viên
        me.initEventsAddEmployee();
        // Khởi tạo sự kiện sửa nhân viên
        me.initEventsEditEmployee();
        // Khởi tạo sự kiện xóa nhân viên
        me.initEventsDeleteEmployee();
        // Khởi tạo sự kiện xóa nhân viên
        me.initEventsDuplicateEmployee();
        // Khởi tạo sự kiện save nhân viên
        me.initEventsSaveEmployee();
        // Khởi tạo sự kiện vô hiệu hóa button xóa và nhân bản
        me.initEventsOffAction();
        // Khởi tạo sự kiện cho table
        me.initEventsTable();
        // Khởi tạo sự kiện format tiền lương
        me.initEventFormatSalary();
        // Event xử lý phân trang
        me.initEventPaginate();
        // Event xử lý lọc theo department
        me.initEventFilterByDepartmentID();
        // Event xử lý lọc theo position
        me.initEventFilterByPositionID();
        // Event xử lý search
        me.initEventSearch();
    }
    // hàm vô hiệu hóa button xóa và nhân bản
    initEventsOffAction() {
        let me = this;
        $(".duplicateEmployee").addClass("disabled");
        $(".removeEmployee").addClass("disabled");
    }
    // hàm mở hành động cho button xóa và nhân bản
    initEventsOnAction() {
        let me = this;
        $(".duplicateEmployee").removeClass("disabled");
        $(".removeEmployee").removeClass("disabled");
    }

    // hàm thêm nhân viên
    initEventsAddEmployee() {
        let me = this;
        $(".add-employee").on("click", () => {
            $("#EmployeeDetail").modal();
            me.formMode = "Post";
            me.formDetail.resetForm(me.formMode);
        });
    }
    // hàm sửa nhân viên
    initEventsEditEmployee() {
        let me = this;
        me.grid.on("dblclick", ".trItem", (e) => {
            $("#EmployeeDetail").modal();
            me.formMode = "Put";
            me.formDetail.resetForm(me.formMode);
            me.EmployeeID = $("tr.trItem.active-tr").find("input").val();
            me.getDataEmployeeByID(me.EmployeeID, me.formMode);
        });
    }
    // hàm xóa nhân viên
    initEventsDeleteEmployee() {
        let me = this;
        $(".removeEmployee").on("click", () => {
            me.EmployeeID = $("tr.trItem.active-tr").find("input").val();
            let employeeCode = $("tr.trItem.active-tr")
                .find("input")
                .attr("code");
            let url = Resource.Link.Employee + "/" + me.EmployeeID;
            if (confirm(`Bạn chắc chắn muốn xóa nhân viên ${employeeCode} ?`)) {
                CommonFn.Ajax(
                    url,
                    Resource.Method.Delete,
                    {},
                    function (response) {
                        if (response) {
                            toast({
                                message: "Bạn đã xóa nhân viên thành công.",
                                type: "success",
                                duration: 2000,
                            });

                            me.getDataEmployee();
                            // me.loadDataEmployee(response.data);
                        } else {
                            console.log("Có lỗi khi lấy dữ liệu từ server");
                        }
                    }
                );
            }
        });
    }
    // hàm duplicate nhân viên
    initEventsDuplicateEmployee() {
        let me = this;
        me.grid.on("click", ".duplicateEmployee", (e) => {
            $("#EmployeeDetail").modal();
            me.formMode = "Post";
            me.formDetail.resetForm(me.formMode);
            me.EmployeeID = $("tr.trItem.active-tr").find("input").val();
            me.getDataEmployeeByID(me.EmployeeID, me.formMode);
        });
    }
    // hàm save nhân viên
    initEventsSaveEmployee() {
        let me = this;
        $("#formEmployee").on("submit", (e) => {
            e.preventDefault();
            var data = me.formDetail.getFormData();
            var id = "";
            if (me.formMode == Resource.Method.Put) {
                id = me.EmployeeID;
            }
            if (me.formDetail.validateForm()) {
                me.formDetail.saveData(data, me.formMode, id);
                if (me.formDetail.error == "e003") {
                    $("#EmployeeCode").addClass("err");
                    $("#EmployeeCode")
                        .parent()
                        .find(".err-message")
                        .text("Mã nhân viên bị trùng");
                } else if (me.formDetail.error == null) {
                    me.getDataEmployee();
                }
            }
        });
    }
    // hàm format lương
    initEventFormatSalary() {
        let me = this;
        $("#salary").on("focusout", (e) => {
            let salary = $("#salary").val();
            salary = salary.replaceAll(".", "");
            $("#salary").val(CommonFn.formatMoney(salary));
        });
    }
    // hàm lọc nhân viên them phòng ban
    initEventFilterByDepartmentID() {
        let me = this;
        $("#department").on("change", function () {
            me.getDataEmployee();
        });
    }
    // hàm lọc nhân viên theo vị trí
    initEventFilterByPositionID() {
        let me = this;
        $("#position").on("change", function () {
            me.getDataEmployee();
        });
    }
    // hàm lọc nhân viên theo search
    initEventSearch() {
        let me = this;
        var debounce = null;
        $("#searchEmployee").on("keyup", function (e) {
            clearTimeout(debounce);
            debounce = setTimeout(function () {
                me.getDataEmployee();
            }, 500);
        });
    }
    /**
     * Khởi tạo trang detail
     */
    initFormDetail() {
        let me = this;

        // Khởi tạo đối tượng form detail
        me.formDetail = new EmployeeDetail("EmployeeDetail");
    }

    /**
     * Khởi tạo sự kiện cho table
     */
    initEventsTable() {
        let me = this;
        // me.grid.off("click", "tr");
        me.grid.on("click", "tr.trItem", function () {
            me.grid.find("tr.trItem.active-tr").removeClass("active-tr");
            $(this).addClass("active-tr");
            me.initEventsOnAction();
        });
    }

    // hàm xử lý phân trang
    initEventPaginate() {
        let me = this;
        // xử lý click vào số phân trang
        me.grid.on("click", ".paginate ul li.pag-item", function () {
            let page = $(this).text();
            me.getDataEmployee(page);
        });
        // xử lý btn next page
        me.grid.on("click", ".paginate ul li.next-page", function () {
            let page = me.current_page + 1;
            me.getDataEmployee(page);
        });
        // xử lý btn last page
        me.grid.on("click", ".paginate ul li.last-page", function () {
            let page = me.total_pages;
            me.getDataEmployee(page);
        });
        // xử lý btn prev page
        me.grid.on("click", ".paginate ul li.prev-page", function () {
            let page = me.current_page - 1;
            me.getDataEmployee(page);
        });
        // xử lý btn first page
        me.grid.on("click", ".paginate ul li.first-page", function () {
            let page = 1;
            me.getDataEmployee(page);
        });
    }
    /**
     * Hàm dùng để lấy dữ liệu employee
     */
    getDataEmployee(page = 1) {
        let me = this;
        let depID = me.grid.find("#department").val();
        let posID = me.grid.find("#position").val();
        let search = me.grid.find("#searchEmployee").val();
        let url =
            Resource.Link.Employee +
            "?page=" +
            page +
            "&depID=" +
            depID +
            "&posID=" +
            posID +
            "&search=" +
            search;
        CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
            if (response) {
                me.loadDataEmployee(response);
            } else {
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
        });
    }
    /**
     * Hàm dùng để lấy dữ liệu department
     */
    getDataDepartment() {
        let me = this,
            url = Resource.Link.Department;

        CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
            if (response) {
                me.loadDataDepartment(response);
            } else {
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
        });
    }
    /**
     * Hàm dùng để lấy dữ liệu position
     */
    getDataPosition() {
        let me = this,
            url = Resource.Link.Position;

        CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
            if (response) {
                me.loadDataPosition(response);
            } else {
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
        });
    }
    /**
     * Hàm dùng để lấy dữ liệu employee theo id
     */
    getDataEmployeeByID(id, formMode) {
        let me = this,
            url = Resource.Link.Employee + "/" + id;

        CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
            if (response) {
                me.formDetail.writeFormData(response, formMode);
            } else {
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
        });
    }

    /**
     * Load dữ liệu employee
     */
    loadDataEmployee(data) {
        let me = this;
        $(".paginate ul").empty();
        me.initEventsOffAction();
        if (data) {
            // Render dữ liệu cho grid
            me.renderGrid(data.data);
            me.renderPaginate(data);
        }
    }
    /**
     * Load dữ liệu department
     */
    loadDataDepartment(data) {
        let me = this;
        if (data) {
            let department = $(".department");
            data.filter((item) => {
                department.append(
                    `<option value="${item.DepartmentID}">${item.DepartmentName}</option>`
                );
            });
        }
    }
    /**
     * Load dữ liệu position
     */
    loadDataPosition(data) {
        let me = this;
        if (data) {
            let position = $(".position");
            data.filter((item) => {
                position.append(
                    `<option value="${item.PositionID}">${item.PositionName}</option>`
                );
            });
        }
    }
    /**
     * Render phân trang
     */
    renderPaginate(data) {
        let me = this;
        // lấy tổng số trang
        me.total_pages = data.total_pages;
        // lấy trang hiện tại
        me.current_page = data.current_page;
        // lấy số bản ghi / 1 trang
        let per_page = data.per_page,
            //lấy tổng số bản ghi
            total = data.total,
            // tính số bản ghi đầu tiên đang hiển thị
            result = (me.current_page - 1) * per_page + 1,
            // tính số bản ghi cuối cùng đang hiển thị
            end = result + per_page - 1;
        if (me.current_page == 1) {
            result = (me.current_page - 1) * per_page + 1;
        }
        if (end > total) {
            end = total;
        }

        $(".content-data-paginate .result-title")
            .text(`Hiển thị ${result}-${end}/${total} nhân
        viên`);
        $(".content-data-paginate .per_page").text(
            `${per_page} nhân viên/trang`
        );
        me.createPagination(me.total_pages, me.current_page);
    }
    /**
     * Render dữ liệu cho grid table employee
     */
    renderGrid(data) {
        let me = this,
            table = $('<table class="table table-striped"></table>'),
            thead = me.renderThead(),
            tbody = me.renderTbody(data);

        table.append(thead);
        table.append(tbody);
        if (data.length < 1) {
            table.append(
                `<div class="text-center pt-3">Không có bản ghi nào phù hợp</div>`
            );
        }

        me.grid.find("table").remove();
        me.grid.find(".content-data-table").append(table);
    }

    /**
     * Reder thead của table
     */
    renderThead() {
        let me = this,
            thead = $("<thead></thead>"),
            tr = $("<tr></tr>");
        me.columnConfig.filter(function (column) {
            let text = column.Text,
                dataType = column.DataType,
                className = me.getClassFormat(dataType),
                th = $("<th></th>");
            if (!text) {
                th.addClass("d-none");
            } else {
                th.text(text);
                th.addClass(className);
            }
            tr.append(th);
        });

        thead.append(tr);

        return thead;
    }

    /**
     * Render tbody của table
     */
    renderTbody(data) {
        let me = this,
            tbody = $("<tbody></tbody>");
        if (data.length > 0) {
            data.filter(function (item) {
                let tr = $("<tr class='trItem'></tr>");

                // Duyệt từng cột để vẽ header
                me.grid.find(".col").each(function () {
                    let fieldName = $(this).attr("FieldName"),
                        dataType = $(this).attr("DataType"),
                        EnumName = $(this).attr("EnumName"),
                        td = $("<td></td>"),
                        value = me.getValueCell(
                            item,
                            fieldName,
                            dataType,
                            EnumName
                        ),
                        className = me.getClassFormat(dataType);
                    if (fieldName == "0") {
                        td = $(
                            `<input type="hidden" code="${item.EmployeeCode}" value="${item.EmployeeID}" />`
                        );
                    } else {
                        td.text(value);
                        td.addClass(className);
                    }

                    tr.append(td);
                    // hàm thêm data vào thẻ tr chỉ có ở jquery để sau lấy dữ liệu trường active k cần gọi api
                    // tr.data("active", item);
                });

                tbody.append(tr);
            });
        }
        return tbody;
    }

    /**
     * Lấy giá trị ô
     * @param {} item
     * @param {*} fieldName
     * @param {*} dataType
     *  @param {*} EnumName
     */
    getValueCell(item, fieldName, dataType, EnumName) {
        let me = this,
            value = item[fieldName];
        switch (dataType) {
            case Resource.DataTypeColumn.Number:
                value = CommonFn.formatMoney(value);
                break;
            case Resource.DataTypeColumn.Date:
                if (value) {
                    value = CommonFn.formatDate(value);
                }
                break;
            case "Enum":
                break;
        }
        if (EnumName == "Gender") {
            value = Resource.Gender[value];
        }
        if (EnumName == "WorkStatus") {
            value = Resource.WorkStatus[value];
        }

        return value;
    }

    /**
     * Hàm dùng để lấy class format cho từng kiểu dữ liệu
     */
    getClassFormat(dataType) {
        let className = "";

        switch (dataType) {
            case Resource.DataTypeColumn.Number:
                className = "text-right";
                break;
            case Resource.DataTypeColumn.Date:
                className = "text-center";
                break;
        }

        return className;
    }
    createPagination(totalPages, page) {
        let me = this;
        let liTag = "";
        let active;
        let beforePage = page - 1;
        let afterPage = page + 1;
        if (page > 1) {
            liTag += `
        <li class="pag-action first-page">
        <img
            src="../assets/icon/btn-firstpage.svg"
            alt=""
        />
        </li>
        <li class="pag-action ml-1 prev-page" >
            <img
                src="../assets//icon/btn-prev-page.svg"
                alt=""
            />
        </li>`;
        } else {
            liTag += `
        <li class="pag-action disabled">
        <img
            src="../assets/icon/btn-firstpage.svg"
            alt=""
        />
        </li>
        <li class="pag-action ml-1 disabled">
            <img
                src="../assets//icon/btn-prev-page.svg"
                alt=""
            />
        </li>`;
        }
        if (page > 2) {
            //if page value is less than 2 then add 1 after the previous button
            liTag += `<li class="pag-item" >1</li>`;
            if (page > 3) {
                //if page value is greater than 3 then add this (...) after the first li or page
                liTag += `<li class="dots"><span>...</span></li>`;
            }
        }
        // how many pages or li show before the current li
        if (page == totalPages && totalPages > 4) {
            beforePage = beforePage - 2;
        } else if (page == totalPages - 1) {
            beforePage = beforePage - 1;
        }
        // how many pages or li show after the current li
        if (page == 1) {
            afterPage = afterPage + 2;
        } else if (page == 2) {
            afterPage = afterPage + 1;
        }
        for (var plength = beforePage; plength <= afterPage; plength++) {
            if (plength < 0) {
                continue;
            }
            if (plength > totalPages) {
                //if plength is greater than totalPage length then continue
                continue;
            }
            if (plength == 0) {
                //if plength is 0 than add +1 in plength value
                plength = plength + 1;
            }
            if (page == plength) {
                //if page is equal to plength than assign active string in the active variable
                active = "active";
            } else {
                //else leave empty to the active variable
                active = "";
            }
            liTag += `<li class="pag-item  ${active}" >${plength}</li>`;
        }
        if (page < totalPages - 1 && totalPages > 4) {
            //if page value is less than totalPage value by -1 then show the last li or page
            if (page < totalPages - 2) {
                //if page value is less than totalPage value by -2 then add this (...) before the last li or page
                liTag += `<li class="dots"><span>...</span></li>`;
            }
            liTag += `<li class="pag-item  ${active}">${totalPages}</li>`;
        }
        if (page < totalPages) {
            //show the next button if the page value is less than totalPage(20)
            liTag += `<li class="pag-action mr-1 next-page" >
        <img
            src="../assets/icon/btn-next-page.svg"
            alt=""
        />
        </li>
        <li class="pag-action last-page" >
            <img
                src="../assets//icon/btn-lastpage.svg"
                alt=""
            />
        </li>`;
        } else {
            liTag += `<li class="pag-action mr-1 disabled" >
        <img
            src="../assets/icon/btn-next-page.svg"
            alt=""
        />
        </li>
        <li class="pag-action disabled">
            <img
                src="../assets//icon/btn-lastpage.svg"
                alt=""
            />
        </li>`;
        }
        $(".paginate ul").append(liTag);
    }
}

// Khởi tạo một biến cho trang nhân viên
var employeePage = new EmployeePage("content");
