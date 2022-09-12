// Resource dùng chung toàn chương trình
var Resource = Resource || {};

// link  gọi API
Resource.Link = {
    Employee: "https://localhost:7284/api/v1/Employees",
    Department: "https://localhost:7284/api/v1/Departments",
    Position: "https://localhost:7284/api/v1/Positions",
};

// Các kiểu dữ liệu của column trong grid
Resource.DataTypeColumn = {
    Number: "Number",
    Date: "Date",
    Enum: "Enum",
    String: "String",
};

// Các method khi gọi ajax
Resource.Method = {
    Get: "Get",
    Post: "Post",
    Put: "Put",
    Delete: "Delete",
};
// Tình trạng công việc
Resource.WorkStatus = {
    0: "Đang thử việc",
    1: "Đang làm việc",
    2: "Đã nghỉ hưu",
    3: "Đã nghỉ việc",
};

// giới tính
Resource.Gender = {
    0: "Nữ",
    1: "Nam",
    2: "Khác",
};

// Các commandType của toolbar
Resource.CommandType = {
    Add: "Add",
    Edit: "Edit",
    Delete: "Delete",
    Refresh: "Refresh",
    Print: "Print",
    Duplicate: "Duplicate",
    Import: "Import",
    Export: "Export",
};

// Các action trên form detail
Resource.CommandForm = {
    Save: "Save",
    Cancel: "Cancel",
};
