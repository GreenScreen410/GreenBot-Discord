import chalk from "chalk";

export default {
  name: "warn",

  run: async (info: string) => {
    console.log(chalk.yellow.bold(`[WARN] ${info}`));
  },
}
