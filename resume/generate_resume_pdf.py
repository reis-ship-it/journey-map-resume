from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas


OUTPUT = "/Users/reisgordon/Websites/journey-map-resume/resume/reis-gordon-resume.pdf"
PAGE_WIDTH, PAGE_HEIGHT = letter

NAVY = HexColor("#1c3650")
SLATE = HexColor("#243142")
MUTED = HexColor("#5d6874")
LINE = HexColor("#d7dde4")
WARM = HexColor("#9f5a2f")
BG = HexColor("#fffdfa")

LEFT = 0.62 * inch
RIGHT = PAGE_WIDTH - 0.62 * inch
TOP = PAGE_HEIGHT - 0.58 * inch
BOTTOM = 0.58 * inch
GUTTER = 0.4 * inch
LEFT_COL = 4.16 * inch
RIGHT_COL_X = LEFT + LEFT_COL + GUTTER
RIGHT_COL_W = RIGHT - RIGHT_COL_X


def draw_wrapped(c, text, x, y, width, font_name, font_size, leading, color=SLATE):
    c.setFont(font_name, font_size)
    c.setFillColor(color)
    words = text.split()
    lines = []
    current = ""
    for word in words:
      trial = f"{current} {word}".strip()
      if c.stringWidth(trial, font_name, font_size) <= width:
          current = trial
      else:
          if current:
              lines.append(current)
          current = word
    if current:
        lines.append(current)

    for idx, line in enumerate(lines):
        c.drawString(x, y - idx * leading, line)
    return y - len(lines) * leading


def draw_section_label(c, label, x, y, width):
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.line(x, y - 3, x + width, y - 3)
    c.setFillColor(WARM)
    c.setFont("Helvetica-Bold", 8.2)
    c.drawString(x, y + 6, label.upper())
    return y - 14


def draw_bullets(c, bullets, x, y, width, font_size=8.8, leading=12.2):
    bullet_x = x
    text_x = x + 12
    for bullet in bullets:
        c.setFillColor(NAVY)
        c.circle(bullet_x + 3, y - 4, 2.5, stroke=0, fill=1)
        y = draw_wrapped(c, bullet, text_x, y, width - 12, "Helvetica", font_size, leading, SLATE)
        y -= 5
    return y


def draw_role(c, title, meta, bullets, x, y, width):
    y = draw_wrapped(c, title, x, y, width, "Helvetica-Bold", 12.2, 13.4, SLATE)
    y -= 1
    y = draw_wrapped(c, meta, x, y, width, "Helvetica", 8.4, 10.6, MUTED)
    y -= 3
    y = draw_bullets(c, bullets, x, y, width, 8.8, 12.2)
    return y - 3


def draw_compact_item(c, title, meta, body, x, y, width):
    y = draw_wrapped(c, title, x, y, width, "Helvetica-Bold", 9.2, 10.5, SLATE)
    y -= 1
    y = draw_wrapped(c, meta, x, y, width, "Helvetica", 7.4, 9.4, MUTED)
    y -= 2
    y = draw_wrapped(c, body, x, y, width, "Helvetica", 8.0, 10.6, SLATE)
    return y - 5


def main():
    c = canvas.Canvas(OUTPUT, pagesize=letter)
    c.setTitle("Reis Gordon Resume")
    c.setAuthor("Reis Gordon")
    c.setSubject("Professional resume")

    c.setFillColor(BG)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)

    c.setFillColor(NAVY)
    c.rect(LEFT, TOP + 10, RIGHT - LEFT, 4, stroke=0, fill=1)
    c.setFillColor(WARM)
    c.rect(RIGHT - 1.45 * inch, TOP + 10, 1.45 * inch, 4, stroke=0, fill=1)

    c.setFillColor(SLATE)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(LEFT, TOP - 4, "Reis Gordon")

    c.setFont("Helvetica", 11.8)
    c.setFillColor(MUTED)
    c.drawString(LEFT, TOP - 24, "Multidisciplinary Producer / Creative Director")

    c.setFont("Helvetica", 9.2)
    c.setFillColor(NAVY)
    contact = "reisjgordon@gmail.com | linkedin.com/in/reis-gordon | reis.quest"
    c.drawString(LEFT, TOP - 46, contact)

    summary = (
        "Multidisciplinary producer and creative director working across film, XR, virtual production, writing, and creative systems. "
        "Brings narrative development, production structure, and strategic research into finished work."
    )
    summary_bottom = draw_wrapped(c, summary, LEFT, TOP - 74, RIGHT - LEFT, "Helvetica", 10.0, 14.0, SLATE)

    left_y = summary_bottom - 6
    left_y = draw_section_label(c, "Experience", LEFT, left_y, LEFT_COL)
    left_y = draw_role(
        c,
        "Founder, AVRAI / avrai.org",
        "Birmingham | Jan 2026 - Present",
        [
            "Launched avrai.org as the public-facing site for AVRAI and clarified the product story around discovery, community, and privacy-first recommendation systems.",
            "Lead product direction, creative framing, website development, and waitlist infrastructure as an active Birmingham-based project.",
        ],
        LEFT,
        left_y,
        LEFT_COL,
    )
    left_y = draw_role(
        c,
        "Associate, Double Eye Studios",
        "New York City | Jun 2025 - Present",
        [
            "Conduct XR-focused market research and strategic analysis for luxury fashion and accessory clients.",
            "Translate research into partnership framing, positioning, and thought-leadership direction.",
        ],
        LEFT,
        left_y,
        LEFT_COL,
    )
    left_y = draw_role(
        c,
        "Consultant, Business Development and Communications, GUM Studios",
        "Brooklyn | May 2025 - Jul 2025",
        [
            "Shaped rebrand messaging, channel priorities, and outward-facing positioning during a growth-focused transition.",
            "Clarified how the studio presented itself to prospective partners and clients.",
        ],
        LEFT,
        left_y,
        LEFT_COL,
    )
    left_y = draw_role(
        c,
        "Intern, Production and Social Media, GUM Studios",
        "Brooklyn | Mar 2025 - May 2025",
        [
            "Supported production, social media, and delivery workflows across music-video and studio work.",
        ],
        LEFT,
        left_y,
        LEFT_COL,
    )
    left_y = draw_role(
        c,
        "Epee Fencing Coach, Birmingham Fencing Club",
        "Birmingham | Aug 2025 - Present",
        [
            "Lead epee coaching while supporting outreach, visibility, and program-development strategy.",
        ],
        LEFT,
        left_y,
        LEFT_COL,
    )

    right_y = summary_bottom - 6
    right_y = draw_section_label(c, "Education Timeline", RIGHT_COL_X, right_y, RIGHT_COL_W)
    right_y = draw_compact_item(
        c,
        "NYU Tisch School of the Arts",
        "MPS, Virtual Production | New York City | Aug 2024 - May 2025",
        "Virtual production MPS; led a 30-person thesis team from concept through delivery.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )
    right_y = draw_compact_item(
        c,
        "NYU Gallatin School of Individualized Study",
        "BA, Business of Emerging Technology for New Media | New York City | Aug 2018 - Aug 2023",
        "Interdisciplinary BA in emerging technology for new media with a Bioethics minor.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )
    right_y = draw_compact_item(
        c,
        "NYU Paris Study Away",
        "Paris | Fall 2019",
        "Fall 2019 study away in French cinema, philosophy, ethics, and art.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )
    right_y = draw_compact_item(
        c,
        "Tampa Preparatory School",
        "Tampa | Feb 2016 - May 2018",
        "Transferred in 2016 and graduated in 2018 before matriculating at NYU Gallatin.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )
    right_y = draw_compact_item(
        c,
        "Denver South High School",
        "Denver | Aug 2014 - Feb 2016",
        "High-school coursework in Denver before transferring to Tampa in 2016.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )
    right_y = draw_compact_item(
        c,
        "Louisville Collegiate School",
        "Louisville | Aug 2010 - May 2014",
        "Attended from fifth through eighth grade before moving to Denver for freshman year.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )
    right_y = draw_compact_item(
        c,
        "Bay Elementary",
        "Fort Walton Beach area | Aug 2007 - May 2010",
        "Elementary school in the Florida panhandle from second through fourth grade.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )
    right_y = draw_compact_item(
        c,
        "Houston Academy",
        "Dothan, Alabama | Aug 2003 - May 2007",
        "Started in pre-K, repeated kindergarten because of the cutoff timing, and completed first grade.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )

    right_y = draw_section_label(c, "Selected Projects", RIGHT_COL_X, right_y, RIGHT_COL_W)
    right_y = draw_compact_item(
        c,
        "AVRAI / avrai.org",
        "Product system and live site | 2026",
        "Public-facing site and product story for a privacy-first discovery platform.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )
    right_y = draw_compact_item(
        c,
        "Wolfe & The Bee",
        "Thesis film | 2025",
        "Graduate thesis short delivered on the LED soundstage at the Martin Scorsese Institute.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )
    right_y = draw_compact_item(
        c,
        "Motel Sunshine Spec Intro",
        "Episodic XR concept | 2024",
        "Proof piece for a larger episodic VR world focused on tone and audience movement.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
    )

    right_y = draw_section_label(c, "Core Strengths", RIGHT_COL_X, right_y, RIGHT_COL_W)
    draw_wrapped(
        c,
        "Creative direction, production, XR storytelling, virtual production, AI media workflows, market research, communications strategy, team leadership, and worldbuilding.",
        RIGHT_COL_X,
        right_y,
        RIGHT_COL_W,
        "Helvetica",
        8.9,
        12.2,
        SLATE,
    )

    c.showPage()
    c.save()


if __name__ == "__main__":
    main()
