"use client";

import { format, subDays } from "date-fns";
import {
  ChevronsUpDownIcon,
  DownloadIcon,
  FunnelXIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { ru } from "react-day-picker/locale";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { ApplicationMetricsResponse, TeamResponse } from "@/shared/api";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import useTimeZone from "@/shared/hooks/use-time-zone";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/shared/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/shared/ui/popover";
import Spinner from "@/shared/ui/spinner";

import { getTeamApplicationsMetrics } from "../api/getTeamApplicationsMetrics";
import { getTeamApplicationsMetricsFile } from "../api/getTeamApplicationsMetricsFile";

const chartConfig = {
  total: {
    label: "Всего",
    color: "var(--color-neutral-500)",
  },
  sent: {
    label: "Отправленные",
    color: "var(--color-blue-500)",
  },
  accepted: {
    label: "Принятые",
    color: "var(--color-green-500)",
  },
  rejected: {
    label: "Отклонённые",
    color: "var(--color-red-500)",
  },
} satisfies ChartConfig;

export function TeamApplicationMetrics({ team }: { team: TeamResponse }) {
  const isMobile = useIsMobile();
  const timeZone = useTimeZone();
  const [isMounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 5),
    to: new Date(),
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [metrics, setMetrics] = useState<ApplicationMetricsResponse>();

  const getMetrics = async () => {
    if (!dateRange || !dateRange.from || !dateRange.to) {
      setMetrics(undefined);
      return;
    }

    const data = await getTeamApplicationsMetrics(team.id, {
      start_date: format(dateRange.from, "yyyy-MM-dd"),
      end_date: format(dateRange.to, "yyyy-MM-dd"),
    });

    setMetrics(data);
  };

  // Запуск пуллинга
  const startPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      getMetrics();
    }, 5000); // Каждые 5 секунд
  };

  // Остановка пуллинга
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Первоначальная загрузка
    getMetrics();

    // Запускаем пуллинг
    startPolling();

    // Останавливаем пуллинг при размонтировании
    return () => {
      stopPolling();
    };
  }, [dateRange, team.id]);

  // Обработчик изменения даты - перезапускаем пуллинг
  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // Перезапускаем пуллинг при изменении даты
    stopPolling();
    startPolling();
  };

  const [exporting, startExporting] = useTransition();

  return (
    <CardRoot className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Динамика заявок по месяцам</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span>Статистика статусов заявок по месяцам.</span>
        </CardDescription>
        <PopoverRoot>
          <CardAction className="flex items-center gap-2 max-md:col-span-1 max-md:row-span-1 max-md:mt-2">
            <Button
              size="sm"
              variant="outline"
              disabled={
                exporting || !dateRange || !dateRange.from || !dateRange.to
              }
              onClick={() => {
                startExporting(async () => {
                  const file = await getTeamApplicationsMetricsFile(team.id, {
                    start_date: format(dateRange!.from!, "yyyy-MM-dd"),
                    end_date: format(dateRange!.to!, "yyyy-MM-dd"),
                  });

                  if (file) {
                    const url = URL.createObjectURL(file);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "Экспорт динамики заявок";
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }
                });
              }}
            >
              {exporting ? <Spinner /> : <DownloadIcon />}
              Экспорт в csv
            </Button>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                {dateRange?.from && dateRange.to && isMounted ? (
                  `${dateRange.from.toLocaleDateString("ru", { month: "long", day: "numeric" })} – ${dateRange.to.toLocaleDateString("ru", { month: "long", day: "numeric" })}`
                ) : (
                  <span>Даты</span>
                )}
                <ChevronsUpDownIcon className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>
          </CardAction>
          <PopoverContent align="end" className="w-auto overflow-hidden p-0">
            <Calendar
              mode="range"
              locale={ru}
              selected={dateRange}
              disabled={{ after: new Date() }}
              onSelect={handleDateChange}
              timeZone={timeZone ?? undefined}
              defaultMonth={dateRange?.from}
              numberOfMonths={isMobile ? 1 : 2}
            />
          </PopoverContent>
        </PopoverRoot>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {!metrics?.metrics.filter((metric) => metric.total !== 0).length ? (
          <Empty className="h-[385.88px]">
            <EmptyMedia variant="icon">
              <XIcon />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Нет данных</EmptyTitle>
              <EmptyDescription>
                За выбранный период нет данных.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setDateRange({
                    from: subDays(new Date(), 5),
                    to: new Date(),
                  })
                }
                className="text-destructive!"
              >
                <FunnelXIcon />
                Сбросить фильтры
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={metrics?.metrics}
              margin={{
                top: 24,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => {
                  const date = new Date(value);
                  const format = date.toLocaleDateString("ru", {
                    month: "short",
                    day: "numeric",
                  });

                  return format.slice(0, 5).replace(".", "");
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value: string) => {
                      const date = new Date(value);
                      const format = date.toLocaleDateString("ru", {
                        month: "long",
                      });

                      return format.charAt(0).toUpperCase() + format.slice(1);
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="sent"
                stackId="a"
                fill="var(--color-sent)"
                radius={[0, 0, 8, 8]}
              />
              <Bar
                dataKey="accepted"
                stackId="a"
                fill="var(--color-accepted)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="rejected"
                stackId="a"
                fill="var(--color-rejected)"
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  dataKey="total"
                  position="top"
                  offset={8}
                  className="fill-foreground text-xs font-medium tabular-nums"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </CardRoot>
  );
}
