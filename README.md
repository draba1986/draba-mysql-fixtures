# draba-mysql-fixtures #
mysql fixtures for tests

## INSTALL ##

    node install draba-mysql-fixtures

## API ##

### fixture.getAllTableNames ###

    fixture.getAllTableNames()
        .then(function (tableNames) {
            //tableNames is a array including all the table name in the database
        });

### fixture.getTableData ###

    fixture.getTableData(tableName)
        .then(function (data) {
            //data is a array including all the data in the table named tableName
        });

### fixture.clearTable ###

    fixture.clearTable(tableName)
        .then(function () {
            //table named tableName has been truncated and now is empty
        });

### fixture.clearAll ###

    fixture.clearAll()
        .then(function () {
            //all the table in the database have been truncated and not are all empty
        });

### fixture.loadData ###

    fixture.loadData(data)
        .then(function (data) {
            //load json object from parameter 'data', and insert data into table, the table name and data are all in the parameter 'data'
        });

    //following is the format of the data

    {
        tableName1:{
            rowName1:{
                columnName1:columnValue1,
                columnName2:columnValue2,
                columnName3:columnValue3
            },
            rowName2:{
                ...
            }
        },
        tableName2:{
            ...
        }
    }

### fixture.loadDataFromFile ###

    fixture.laodDataFromFile(filename)
        .then(function (data) {
            //load json object from file, and insert data into table
        });

    //same as loadData but from file
    //the data in the file, the function will require the file and loadData
