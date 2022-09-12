class EmployeeDetail {
    constructor(formId) {
        let me = this;

        me.form = $(`#${formId}`);
        // me.getEmployeeCode();
    }

    /**
     * Xử lý validate form
     */
    validateForm() {
        let me = this,
            isValid = me.validateRequire();
        if (isValid) {
            isValid = me.validateDate();
        }
        return isValid;
    }

    /**
     * Validate các trường băt buộc
     */
    validateRequire() {
        let me = this,
            isValid = true;

        me.form.find("[require]").each(function () {
            let value = $(this).val();

            if (!value) {
                isValid = false;

                $(this).addClass("err");
                $(this)
                    .parent()
                    .find(".err-message")
                    .text("Trường này bắt buộc phải nhập");
            } else {
                $(this).removeClass("err");
                $(this).parent().find(".err-message").text("");
            }
        });

        return isValid;
    }

    // validate ngày trước ngày hiện tại
    validateDate() {
        let me = this,
            isValid = true;

        me.form.find('input[type="date"]').each(function () {
            let value = $(this).val();
            if (value) {
                if (!me.isAfterToday(value)) {
                    console.log("sadasd");
                    $(this).removeClass("err");
                    $(this).parent().find(".err-message").text("");
                } else {
                    isValid = false;
                    $(this).addClass("err");
                    $(this)
                        .parent()
                        .find(".err-message")
                        .text("Không được lớn hơn ngày hiện tại");
                }
            }
        });

        return isValid;
    }
    // hàm check trước ngày hiện tại
    isAfterToday(date) {
        return new Date(date).valueOf() > new Date().valueOf();
    }

    /**
     * Lấy dữ liệu form
     */
    getFormData() {
        let me = this,
            data = {};
        me.form.find("[name]").each(function () {
            let dataType = $(this).attr("DataType") || "String",
                enumName = $(this).attr("EnumName") || "",
                field = $(this).attr("name"),
                value = null;

            switch (dataType) {
                case Resource.DataTypeColumn.String:
                    value = $(this).val();
                    break;
                case Resource.DataTypeColumn.Date:
                    value = $(this).val();
                    if (!value) {
                        value = null;
                    }
                    break;
                case Resource.DataTypeColumn.Number:
                    if ($(this).val()) {
                        value = parseInt($(this).val().replaceAll(".", ""));
                    }
                    break;
            }
            if (dataType == "Select") {
                value = $(this).find("option").filter(":selected").val();
            }
            if (enumName == "Gender" || enumName == "WorkStatus") {
                if ($(this).val()) {
                    value = parseInt($(this).val().replaceAll(".", ""));
                }
            }

            data[field] = value;
        });

        return data;
    }
    // điền data vào form

    writeFormData(dataEmployee, formMode) {
        let me = this;
        if (dataEmployee) {
            Object.keys(dataEmployee).filter(() => {
                me.form.find("[name]").each(function () {
                    let dataType = $(this).attr("DataType") || "String",
                        enumName = $(this).attr("EnumName") || "",
                        duplicate = $(this).attr("Duplicate") || "",
                        field = $(this).attr("name");
                    //nếu là duplicate thì lấy mã nhân viên mới nhất
                    if (duplicate && formMode == Resource.Method.Post) {
                        $(this).val(me.EmployeeCode);
                        setTimeout(() => {
                            $(this).focus();
                        }, 500);
                    } else if (duplicate && formMode == Resource.Method.Put) {
                        $(this).val(dataEmployee[field]);
                        setTimeout(() => {
                            $(this).focus();
                        }, 500);
                    } else {
                        switch (dataType) {
                            case Resource.DataTypeColumn.String:
                                $(this).val(dataEmployee[field]);
                                break;
                            case Resource.DataTypeColumn.Date:
                                if (dataEmployee[field]) {
                                    var date = CommonFn.formatDate1(
                                        dataEmployee[field]
                                    );
                                    $(this).val(date);
                                }
                                break;
                            case Resource.DataTypeColumn.Number:
                                $(this).val(
                                    CommonFn.formatMoney(dataEmployee[field])
                                );
                                break;
                        }
                        if (dataType == "Select") {
                            $(this).val(dataEmployee[field]);
                        }
                    }
                });
            });
        }
    }

    /**
     * xử lý lưu dữ liệu
     */
    saveData(data, formMode, id) {
        let me = this,
            method = Resource.Method.Post,
            url = Resource.Link.Employee;

        if (formMode == Resource.Method.Put) {
            method = Resource.Method.Put;
            url = Resource.Link.Employee + "/" + id;
        }

        CommonFn.Ajax(url, method, data, function (response) {
            if (response) {
                if (response == "e003") {
                    me.error = "e003";
                } else {
                    me.error = null;
                    $(me.form).modal("hide");
                    if (formMode == Resource.Method.Put) {
                        toast({
                            message: "Bạn đã cập nhật nhân viên thành công.",
                            type: "warning",
                            duration: 2000,
                        });
                    }
                    if (formMode == Resource.Method.Post) {
                        toast({
                            message: "Bạn đã thêm nhân viên thành công.",
                            type: "success",
                            duration: 2000,
                        });
                    }
                }
            }
        });
    }

    /**
     * Reset nội dung form
     */
    resetForm(formMode) {
        let me = this;
        me.form.find("input.err").each(function () {
            $(this).removeClass("err");
        });

        me.form.find("[name]").each(function () {
            let dataType = $(this).attr("DataType") || "String";
            let valueRequire = $(this).attr("ValueRequire") || "";
            switch (dataType) {
                case Resource.DataTypeColumn.Date:
                    $(this).val(new Date());
                    break;
                case Resource.DataTypeColumn.String:
                    $(this).val("");
                    break;
                case Resource.DataTypeColumn.Number:
                    $(this).val("");
                    break;
            }
            if (dataType == "Select") {
                $(this).prop("selectedIndex", 0);
            }
            if (valueRequire) {
                if (formMode == Resource.Method.Post) {
                    me.getEmployeeCode();
                    $(this).val(me.EmployeeCode);
                    setTimeout(() => {
                        $(this).focus();
                    }, 500);
                }
                if (formMode == Resource.Method.Put) {
                    $(this).val("");
                    // setTimeout(() => {
                    //     $(this).focus();
                    // }, 800);
                }
            }
            $(this).removeClass("err");
            $(this).parent().find(".err-message").text("");
        });
    }
    // hàm lấy mã nhân viên
    getEmployeeCode() {
        let me = this,
            url = Resource.Link.Employee + "/new-code";
        CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
            if (response) {
                me.EmployeeCode = response;
            } else {
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
        });
    }
}
