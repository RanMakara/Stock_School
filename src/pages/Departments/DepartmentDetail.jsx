import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { departmentConfig } from "../../utils/moduleConfigs";

export default function DepartmentDetail() {
  useDocumentTitle("Departments • School Stock Management");
  return <CrudPage config={departmentConfig} mode="detail" />;
}
