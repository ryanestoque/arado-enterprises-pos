import AuditLogsTable from "@/components/auditlogs/AuditLogsTable";
import { SiteHeader } from "@/components/common/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useAuditLogs } from "@/hooks/useAPI";
import { useEffect, useState } from "react";

export default function AuditLogs() {
    const { data: auditlogs = [] } = useAuditLogs()
    const [localAuditlogs, setLocalAuditlogs] = useState<any[]>([])
  
    useEffect(() => {
      setLocalAuditlogs(auditlogs)
    }, [AuditLogs])

  return(
    <>
      <header className="overflow-hidden">
        <SiteHeader title="Audit Logs"/>
      </header>
      <main className="@container/main w-full h-[80vh] flex-1 p-4 md:p-6">
        <Card className="h-full">
          <CardContent className="px-2 overflow-x-auto">
            <AuditLogsTable data={localAuditlogs}/>
          </CardContent>
        </Card>
      </main>
    </>
  )
}