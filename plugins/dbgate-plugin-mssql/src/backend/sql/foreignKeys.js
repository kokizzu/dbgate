module.exports = `
SELECT
    schemaName = FK.TABLE_SCHEMA,
    pureName = FK.TABLE_NAME,
    columnName = CU.COLUMN_NAME,

    refSchemaName = ISNULL(IXS.name, PK.TABLE_SCHEMA),
    refTableName = ISNULL(IXT.name, PK.TABLE_NAME),
    refColumnName = IXCC.name,

    constraintName = C.CONSTRAINT_NAME,
    updateAction = rc.UPDATE_RULE,
    deleteAction = rc.DELETE_RULE,

    objectId = o.object_id 

FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS C
INNER JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS FK ON C.CONSTRAINT_NAME = FK.CONSTRAINT_NAME

LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS PK ON C.UNIQUE_CONSTRAINT_NAME = PK.CONSTRAINT_NAME
LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE CU ON C.CONSTRAINT_NAME = CU.CONSTRAINT_NAME
--LEFT JOIN (
--SELECT i1.TABLE_NAME, i2.COLUMN_NAME
--FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS i1
--INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE i2 ON i1.CONSTRAINT_NAME = i2.CONSTRAINT_NAME
--WHERE i1.CONSTRAINT_TYPE = 'PRIMARY KEY'
--) PT ON PT.TABLE_NAME = PK.TABLE_NAME
INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc ON FK.CONSTRAINT_NAME = rc.CONSTRAINT_NAME

LEFT JOIN sys.indexes IX ON IX.name = C.UNIQUE_CONSTRAINT_NAME
LEFT JOIN sys.objects IXT ON IXT.object_id = IX.object_id
LEFT JOIN sys.index_columns IXC ON IX.index_id = IXC.index_id and IX.object_id = IXC.object_id
LEFT JOIN sys.columns IXCC ON IXCC.column_id = IXC.column_id AND IXCC.object_id = IXC.object_id
LEFT JOIN sys.schemas IXS ON IXT.schema_id = IXS.schema_id

inner join sys.objects o on FK.TABLE_NAME = o.name
inner join sys.schemas s on o.schema_id = s.schema_id and FK.TABLE_SCHEMA = s.name

where o.object_id =OBJECT_ID_CONDITION and s.name =SCHEMA_NAME_CONDITION
`;
