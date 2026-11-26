import { describe, expect, it } from "vitest";
import { TEMPLATES, notifyBeat } from "./notifyTemplates";

describe("parent notification templates", () => {
  it("assignment reminder pre-fills the brief's text", () =>
    expect(TEMPLATES["Assignment reminder"]).toBe(
      "Hi Jordan, a reminder that Alex's Cellular Respiration Lab is due tomorrow, Thursday.",
    ));
  it("maps the demonstration onto Select, Send, and Delivered", () => {
    expect(notifyBeat("select")).toBe("Select");
    expect(notifyBeat("notify")).toBe("Select");
    expect(notifyBeat("compose")).toBe("Send");
    expect(notifyBeat("send")).toBe("Send");
    expect(notifyBeat("deliver")).toBe("Delivered");
    expect(notifyBeat("open")).toBe("Delivered");
  });
});
