import {environment} from '../environments/environment'
export class Global {
    public static BASE_PATH = environment.baseUrl;

    public static JOBS_LIST_URL = Global.BASE_PATH + "/jobList2";

    public static JOBS_CREATE_URL = Global.BASE_PATH + "/jobCreation";
    // public static COORD_LIST_URL = Global.BASE_PATH + "/getScheduledJobs";
    // public static SCHEDULER = Global.BASE_PATH + "/scheduler";
    // public static OOZIEOPTIONS = Global.BASE_PATH + "/oozieJobOptions";
    

    public static COORD_LIST_URL = Global.BASE_PATH + "/getScheduledJobs";
    public static SCHEDULER = Global.BASE_PATH + "/scheduler";
    public static OOZIEOPTIONS = Global.BASE_PATH + "/oozieJobOptions";

    public static TABLES_LIST_URL = Global.BASE_PATH + "/dbTablesList";

    public static SCHEMAS_LIST_URL = Global.BASE_PATH + "/dbSchemas";

    public static COLUMNS_LIST_URL = Global.BASE_PATH + "/columnsList";

    public static LOGIN_URL = Global.BASE_PATH + "/login";

    public static DEPLOY_URL = Global.BASE_PATH + "/jobDeploy";

    public static EXECUTE_URL = Global.BASE_PATH + "/jobExecute";
    public static IncrimentalColumns_URL = Global.BASE_PATH + "/IncrimentalColumns";
    public static RERUN_URL = Global.BASE_PATH + "/Rerun";

    public static File_Upload_URL = Global.BASE_PATH + "/fileDataTypesFinder";

    public static CREATE_CSV_JOB_URL = Global.BASE_PATH + "/uploadFile";

    public static DATA_ACCESS_BASE_URL = Global.BASE_PATH;

    public static VIZ_TBL_LIST = Global.BASE_PATH + "/fetchUserTables";
    public static VIZ_COL_LIST = Global.BASE_PATH + "/stagingColumns";
    public static VIZ_CHARTS = Global.BASE_PATH + "/fetchVizChart";
    public static JOBS_FLOW_URL = Global.BASE_PATH + "/fetchFlowForUser";
    public static ICE_COL_LIST = Global.BASE_PATH + "/IndirectmaterialList";
    public static ICE_DATA_JSON = Global.BASE_PATH + "/IndirectmaterialDataJson";
    public static ICE_CLASS = Global.BASE_PATH + "/IndirectmaterialClass";
    public static ICE_FAMILY = Global.BASE_PATH + "/IndirectmaterialFamily";
    public static ICE_SEGMENT = Global.BASE_PATH + "/IndirectmaterialSegment";
    public static ICE_TBL_DATA = Global.BASE_PATH + "/IndirectmaterialTblData";
    public static SET_UNSPC_TITLE = Global.BASE_PATH + "/WritebackSelectedUnspcTitle";

    public static FIND_AND_REPLACE_END_POINT = Global.BASE_PATH + "/findAndReplace";
    public static DATE_AND_FILTER_END_POINT = Global.BASE_PATH + "/dateFilter";
    public static CONCAT_COLUMNS_END_POINT = Global.BASE_PATH + "/concatColumns";
    public static NUMBER_FILTER_END_POINT = Global.BASE_PATH + "/numberFilter";


}