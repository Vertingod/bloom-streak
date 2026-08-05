export type PwaInstallState = "listening" | "ready" | "installed" | "unsupported";

export type PwaInstallCopy = {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  helperText: string;
};

export type StandaloneSignals = {
  matches?: boolean;
  standalone?: boolean;
};

export function isStandaloneMode(signals: StandaloneSignals): boolean {
  return Boolean(signals.matches || signals.standalone);
}

export function getPwaInstallCopy(state: PwaInstallState): PwaInstallCopy {
  if (state === "installed") {
    return {
      eyebrow: "PWA Ready",
      title: "BloomStreak 已经住进桌面",
      description: "下次可以像打开 App 一样，直接回到今天的花园。",
      buttonLabel: "已安装",
      helperText: "继续保持这个小入口，让习惯回访变得更轻。",
    };
  }

  if (state === "ready") {
    return {
      eyebrow: "Mobile ritual",
      title: "安装 BloomStreak",
      description: "把习惯花园放到桌面，每天少一步阻力，多一次回到自己的节奏。",
      buttonLabel: "安装到桌面",
      helperText: "安装后会以独立窗口打开，不影响本地与 Supabase 同步数据。",
    };
  }

  if (state === "unsupported") {
    return {
      eyebrow: "Browser tip",
      title: "可以从浏览器菜单安装",
      description: "如果当前浏览器没有弹出安装按钮，请在浏览器菜单中选择“添加到主屏幕”或“安装应用”。",
      buttonLabel: "等待浏览器支持",
      helperText: "Chrome、Edge 和大多数移动端浏览器都支持 PWA 安装入口。",
    };
  }

  return {
    eyebrow: "PWA Ready",
    title: "安装 BloomStreak",
    description: "像打开 App 一样回到今天的花园，减少每天打卡前的心理阻力。",
    buttonLabel: "准备安装中",
    helperText: "浏览器检测到可安装条件后，这里会出现安装按钮。",
  };
}
