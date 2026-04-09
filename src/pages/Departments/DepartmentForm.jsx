import CrudPage from "../../components/common/CrudPage";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { departmentConfig } from "../../utils/moduleConfigs";

export default function DepartmentForm() {
  useDocumentTitle("Departments • School Stock Management");
  return <CrudPage config={departmentConfig} mode="form" />;
}
