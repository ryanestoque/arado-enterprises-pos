import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { AuditLogs } from "./Columns";

export default function AuditLogsActions({ auditlog }: { auditlog: AuditLogs }) {
  return(
    <>
      <Dialog>
        <DialogTrigger>
          <Button variant={"outline"}>
            Details
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>
        
          <div className="space-y-4">
            <div>
              <h3>Before</h3>
              <pre className="max-w-lg bg-muted p-4 rounded border text-sm overflow-auto font-mono whitespace-pre-wrap">
                {JSON.stringify(
                    typeof auditlog.before_data === "string" ? JSON.parse(auditlog.before_data) : auditlog.before_data,
                    null,
                    2
                )}
              </pre>
            </div>

            <div>
              <h3>After</h3>
              <pre className="max-w-lg bg-muted p-4 rounded border text-sm overflow-auto font-mono whitespace-pre-wrap ">
                {JSON.stringify(
                    typeof auditlog.after_data === "string" ? JSON.parse(auditlog.after_data) : auditlog.after_data,
                    null,
                    2
                )}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}