import * as os from "os";

export const getCpuUsage = () => {
  const totalCPU = os
    .cpus()
    .map((cpu) =>
      Object.values(cpu.times).reduce((a: number, b: number) => a + b, 0)
    )
    .reduce((a, b) => a + b, 0);
  const cpuUsage =
    1 -
    os
      .cpus()
      .map((cpu) => cpu.times.idle)
      .reduce((a: number, b: number) => a + b, 0) /
      totalCPU;
  return cpuUsage * 100;
};

export const getMemUsage = () => {
  return (1 - os.freemem() / os.totalmem()) * 100;
};
