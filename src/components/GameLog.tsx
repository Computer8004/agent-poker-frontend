import type { GameLogEntry } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Terminal } from 'lucide-react';

interface GameLogProps {
  logs: GameLogEntry[];
}

export function GameLog({ logs }: GameLogProps) {
  const getLogColor = (type: string) => {
    switch (type) {
      case 'action':
        return 'text-primary';
      case 'winner':
        return 'text-yellow-500';
      case 'system':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="bg-card/80 border border-border rounded-lg p-4 h-64 flex flex-col">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <History className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">Mission Log</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          {logs.length === 0 ? (
            <div className="text-muted-foreground text-sm italic flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              No activity recorded yet...
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-sm border-l-2 border-primary/30 pl-3 py-1">
                <div className="text-xs text-muted-foreground mb-1">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className={getLogColor(log.type)}>{log.message}</div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
