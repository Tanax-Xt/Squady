"use client";

import { format, subDays } from "date-fns";
import { ChevronsUpDownIcon, FunnelXIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { ru } from "react-day-picker/locale";
import { Label, LabelList, Pie, PieChart } from "recharts";

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

import { getTeamApplicationsMetrics } from "../api/getTeamApplicationsMetrics";

const words: Record<Intl.LDMLPluralRule, string> = {
  zero: "Заявок",
  one: "Заявка",
  two: "Заявки",
  few: "Заявок",
  many: "Заявок",
  other: "Заявки",
};

const chartConfig = {
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

export function TeamApplicationMetricsInvites({
  team,
}: {
  team: TeamResponse;
}) {
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

  const chartData = [
    { status: "sent", value: metrics?.sent, fill: "var(--color-sent)" },
    {
      status: "accepted",
      value: metrics?.accepted,
      fill: "var(--color-accepted)",
    },
    {
      status: "rejected",
      value: metrics?.rejected,
      fill: "var(--color-rejected)",
    },
  ].filter((item) => item.value !== 0 && item.value !== undefined);

  return (
    <CardRoot className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Статусы заявок</CardTitle>
        <CardDescription>
          Визуализация заявок по статусам за выбранный период.
        </CardDescription>
        <PopoverRoot>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline" asChild>
              <CardAction className="max-md:col-span-1 max-md:row-span-1 max-md:mt-2">
                {dateRange?.from && dateRange.to && isMounted ? (
                  `${dateRange.from.toLocaleDateString("ru", { month: "long", day: "numeric" })} – ${dateRange.to.toLocaleDateString("ru", { month: "long", day: "numeric" })}`
                ) : (
                  <span>Даты</span>
                )}
                <ChevronsUpDownIcon className="text-muted-foreground" />
              </CardAction>
            </Button>
          </PopoverTrigger>
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
        {!chartData.length ? (
          <Empty className="h-[300px]">
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
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="status"
                innerRadius={54}
              >
                <LabelList
                  dataKey="value"
                  className="fill-white tabular-nums"
                  stroke="none"
                  fontSize={16}
                  formatter={(value: number) => value || ""}
                />
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold tabular-nums"
                          >
                            {chartData
                              .map((item) => item.value)
                              .filter((value) => value !== undefined)
                              .reduce((a, b) => a + b)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {
                              words[
                                new Intl.PluralRules("ru", {
                                  type: "ordinal",
                                }).select(
                                  chartData
                                    .map((item) => item.value)
                                    .filter((value) => value !== undefined)
                                    .reduce((a, b) => a + b),
                                )
                              ]
                            }
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </CardRoot>
  );
}
