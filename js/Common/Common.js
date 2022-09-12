// Các hàm dùng chung toàn chương trình
var CommonFn = CommonFn || {};

// Hàm format số tiền
CommonFn.formatMoney = (money) => {
    if (money && !isNaN(money)) {
        return money.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.");
        //return money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&.");
    } else {
        return money;
    }
};

// Format ngày tháng
CommonFn.formatDate = (dateSrc) => {
    let date = new Date(dateSrc),
        year = date.getFullYear().toString(),
        month = (date.getMonth() + 1).toString().padStart(2, "0"),
        day = date.getDate().toString().padStart(2, "0");

    return `${day}/${month}/${year}`;
};
// Format ngày tháng để đọc được
CommonFn.formatDate1 = (dateSrc) => {
    let date = new Date(dateSrc),
        year = date.getFullYear().toString(),
        month = (date.getMonth() + 1).toString().padStart(2, "0"),
        day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// Hàm ajax gọi lên server lấy dữ liệu
CommonFn.Ajax = (url, method, data, fnCallBack, async = false) => {
    $.ajax({
        url: url,
        method: method,
        async: async,
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response, textStatus, jqXHR) {
            fnCallBack(response);
        },
        error: function (errormessage, textStatus, jqXHR) {
            fnCallBack(errormessage.responseText);

            // console.log(errormessage.responseText);
        },
    });
};
