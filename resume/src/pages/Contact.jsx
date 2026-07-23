import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const Contact = () => {
  return (
    <div className="space-y-8 max-w-xl mx-auto py-12 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-slate-500 leading-relaxed text-sm">
          Have queries or feedback? Drop us a line below and we'll reply shortly.
        </p>
      </div>

      <Card className="text-left space-y-4">
        <Input label="Name" name="name" placeholder="Your Name" />
        <Input label="Email" name="email" type="email" placeholder="Your Email" />
        <Input label="Message" name="message" type="textarea" placeholder="Write your message..." />
        <Button variant="primary" className="w-full">Send Message</Button>
      </Card>
    </div>
  );
};

export default Contact;
